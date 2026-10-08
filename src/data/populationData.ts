import { CSVRowRecord } from '../types';

export const RAW_CSV_TEXT = `DataSeries,2023,2021,2019,2007,2022,2020,2017,2013,2010
Overweight (Excluding Obese) - Total,na,na,na,na,28.6,28.8,27.5,25.7,29.8
Obese - Total,na,na,na,na,11.6,10.5,8.6,8.6,10.5
Daily Smoking - Total,8.8,10.4,10.6,13.3,9.2,10.1,11.8,13.1,13.9
Diabetes Mellitus - Total,na,na,na,na,8.5,9.5,8.8,na,8.6
Hypertension - Total,na,na,na,na,37,35.5,24.2,na,19.8
Hyperlipidaemia - Total,na,na,na,na,31.9,39.1,35.5,na,26.2
Sufficient Total Physical Activity - Total,78.5,76,84.6,85.4,74.9,80.6,84,79.5,na
Binge Drinking - Total,10.3,9.6,10.2,4.3,9.4,10.5,8.8,7.4,na
Proportion Of Singapore Residents Who Were Screened For Chronic Diseases According To The Recommended Frequency - Total,62.6,59.2,66.3,58.1,60.3,63,66.4,56,45.2
Overweight (Excluding Obese) - Male,na,na,na,na,33.4,33.5,36.2,30.8,35.1
Obese - Male,na,na,na,na,13.1,11.9,7,9.4,11.7
Daily Smoking - Male,15.7,17.8,18.4,23.1,16,17,20.6,23,24
Diabetes Mellitus - Male,na,na,na,na,9.7,10.6,10.3,na,9.2
Hypertension - Male,na,na,na,na,44,41,27,na,22
Hyperlipidaemia - Male,na,na,na,na,36.2,42.8,42.8,na,28.8
Sufficient Total Physical Activity - Male,80,78.1,85.6,85.2,76.7,80.4,84.6,82.5,na
Binge Drinking - Male,13.7,13.8,14.9,6.4,13.1,14.6,13.1,10.7,na
Proportion Of Singapore Residents Who Were Screened For Chronic Diseases According To The Recommended Frequency - Male,61.9,61.3,67.5,59.9,59.2,63.9,65.9,55,47.8
Overweight (Excluding Obese) - Female,na,na,na,na,23.9,24.3,19.2,20.7,24.6
Obese - Female,na,na,na,na,10.2,9.3,10,7.8,9.4
Daily Smoking - Female,2.3,3.3,3.2,3.8,2.7,3.4,3.3,3.6,4.1
Diabetes Mellitus - Female,na,na,na,na,7.3,8.4,7.4,na,8
Hypertension - Female,na,na,na,na,30.2,30.2,21.7,na,17.6
Hyperlipidaemia - Female,na,na,na,na,27.9,35.8,28.5,na,23.6
Sufficient Total Physical Activity - Female,76.9,74.1,83.6,85.7,73.2,80.7,83.5,76.6,na
Binge Drinking - Female,7.1,5.6,5.7,2.2,5.7,6.5,4.7,4.2,na
Proportion Of Singapore Residents Who Were Screened For Chronic Diseases According To The Recommended Frequency - Female,63.3,57.5,65.2,56.4,61.1,62.2,66.8,56.9,42.8`;

export interface ParseResult {
  valid: boolean;
  rows: CSVRowRecord[];
  yearsSorted: string[];
  errors: string[];
  metadata: {
    rowCount: number;
    filename: string;
    targetPopulation: string;
    columns: string[];
  };
}

export function parseHealthSurveyCSV(csvContent: string): ParseResult {
  const errors: string[] = [];
  // Strip BOM if present
  let cleanContent = csvContent;
  if (cleanContent.charCodeAt(0) === 0xfeff) {
    cleanContent = cleanContent.slice(1);
  }

  const rawLines = cleanContent
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (rawLines.length < 2) {
    return {
      valid: false,
      rows: [],
      yearsSorted: [],
      errors: ['File contains insufficient rows. Expected header + 27 data rows.'],
      metadata: { rowCount: 0, filename: '', targetPopulation: '', columns: [] },
    };
  }

  // Parse header with quote support
  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let insideQuote = false;
    let current = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          current += '"';
          i++; // Skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const header = parseRow(rawLines[0]);
  if (header[0] !== 'DataSeries') {
    errors.push(`Invalid first column header: "${header[0]}". Expected "DataSeries".`);
  }

  const yearColumns = header.slice(1);
  const yearsSorted = [...yearColumns].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  const seenSeries = new Set<string>();
  const parsedRecords: CSVRowRecord[] = [];

  for (let r = 1; r < rawLines.length; r++) {
    const line = rawLines[r];
    const cells = parseRow(line);

    if (cells.length !== header.length) {
      errors.push(`Row ${r + 1} has ${cells.length} columns, expected ${header.length}.`);
      continue;
    }

    const seriesName = cells[0];
    if (seenSeries.has(seriesName)) {
      errors.push(`Duplicate data series found: "${seriesName}" at row ${r + 1}.`);
    }
    seenSeries.add(seriesName);

    const yearlyValues: Record<string, number | null> = {};
    for (let c = 1; c < cells.length; c++) {
      const year = header[c];
      const valStr = cells[c].toLowerCase();

      if (valStr === 'na' || valStr === '' || valStr === 'null') {
        yearlyValues[year] = null;
      } else {
        const num = parseFloat(valStr);
        if (isNaN(num)) {
          yearlyValues[year] = null;
          errors.push(`Invalid non-numeric value "${cells[c]}" in row ${r + 1}, column "${year}".`);
        } else {
          yearlyValues[year] = num;
        }
      }
    }

    // Select latest non-null year numerically
    let latestYear = '';
    let latestValue: number | null = null;
    let baselineYear = '';
    let baselineValue: number | null = null;

    for (const yr of yearsSorted) {
      const v = yearlyValues[yr];
      if (v !== null && v !== undefined) {
        if (!baselineYear) {
          baselineYear = yr;
          baselineValue = v;
        }
        latestYear = yr;
        latestValue = v;
      }
    }

    let percentagePointChange: number | null = null;
    if (baselineValue !== null && latestValue !== null) {
      percentagePointChange = Math.round((latestValue - baselineValue) * 10) / 10;
    }

    parsedRecords.push({
      dataSeries: seriesName,
      yearlyValues,
      latestYear,
      latestValue,
      baselineYear,
      baselineValue,
      percentagePointChange,
    });
  }

  return {
    valid: errors.length === 0,
    rows: parsedRecords,
    yearsSorted,
    errors,
    metadata: {
      rowCount: parsedRecords.length,
      filename: 'PrevalenceOfOverweightObesityDailySmokingHypertensionDiabetesMellitusHyperlipidaemiaSufficientTotalPhysicalActivityAndBingeDrinkingAmongResidentsAged1874Years(1).csv',
      targetPopulation: 'Singapore Residents Aged 18-74 Years',
      columns: header,
    },
  };
}

export const INITIAL_POPULATION_DATA = parseHealthSurveyCSV(RAW_CSV_TEXT);
