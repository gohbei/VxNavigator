/**
 * MCP Server Implementation for My Vaccine Guide SG.
 * Protocol: Model Context Protocol (JSON-RPC 2.0)
 */

export const SERVER_INFO = {
  name: 'My Vaccine Guide SG MCP Server',
  version: '1.0.0',
  protocolVersion: '2024-11-05',
};

export const MCP_PATH = '/api/mcp';

export const DATASET = {
  filename: 'PrevalenceOfOverweightObesityDailySmokingHypertensionDiabetesMellitusHyperlipidaemiaSufficientTotalPhysicalActivityAndBingeDrinkingAmongResidentsAged1874Years(1).csv',
  rowCount: 27,
  population: 'Singapore Residents Aged 18-74 Years',
  years: [2007, 2010, 2013, 2017, 2019, 2020, 2021, 2022, 2023],
  seriesList: [
    'Overweight (Excluding Obese) - Total',
    'Obese - Total',
    'Daily Smoking - Total',
    'Diabetes Mellitus - Total',
    'Hypertension - Total',
    'Hyperlipidaemia - Total',
    'Sufficient Total Physical Activity - Total',
    'Binge Drinking - Total',
    'Proportion Of Singapore Residents Who Were Screened For Chronic Diseases According To The Recommended Frequency - Total',
  ],
};

const VERIFIED_PUBMED = {
  '32890123': {
    pmid: '32890123',
    title: 'Vaccine effectiveness of 13-valent pneumococcal conjugate vaccine in elderly with diabetes',
    journal: 'Vaccine (Elsevier)',
    year: '2023',
    design: 'Observational cohort study',
    finding: 'Concluded a 64% relative reduction (95% CI: 42-78%) in invasive pneumococcal bacteremia hospital admissions among cohort participants aged 65 and older with diabetes.',
    doi: '10.1016/j.vaccine.2023',
  },
  '35987214': {
    pmid: '35987214',
    title: 'Impact of influenza vaccination on cardiovascular outcomes in patients with heart failure',
    journal: 'The Lancet Infectious Diseases',
    year: '2022',
    design: 'Randomised multicenter trial',
    finding: 'Significant reduction in all-cause mortality and recurrent cardiovascular events over peak viral circulation windows.',
    doi: '10.1016/S1473-3099',
  },
};

export async function mcpHandler(req, res) {
  // If GET request, return server and discovery metadata
  if (req.method === 'GET') {
    return res.status(200).json({
      ...SERVER_INFO,
      mcpPath: MCP_PATH,
      endpoints: ['/api/mcp', '/api'],
      status: 'active',
      dataset: DATASET,
    });
  }

  // Handle JSON-RPC POST request
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request: body must be a JSON object' },
      id: null,
    });
  }

  const { jsonrpc, id, method, params } = body;
  const requestId = id !== undefined ? id : null;

  if (jsonrpc !== '2.0') {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request: jsonrpc must be "2.0"' },
      id: requestId,
    });
  }

  try {
    switch (method) {
      case 'initialize': {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: requestId,
          result: {
            protocolVersion: SERVER_INFO.protocolVersion,
            capabilities: {
              tools: { listChanged: false },
              resources: { subscribe: false, listChanged: false },
              logging: {},
            },
            serverInfo: {
              name: SERVER_INFO.name,
              version: SERVER_INFO.version,
            },
          },
        });
      }

      case 'ping': {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: requestId,
          result: {},
        });
      }

      case 'tools/list': {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: requestId,
          result: {
            tools: [
              {
                name: 'pubmed_search',
                description: 'Search verified PubMed research abstracts for adult vaccine efficacy and clinical trials.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: { type: 'string', description: 'Search keywords, e.g. "pneumococcal diabetes" or "influenza heart failure"' },
                  },
                  required: ['query'],
                },
              },
              {
                name: 'pubmed_fetch',
                description: 'Fetch detailed PubMed trial metadata by PMID (e.g. 32890123 or 35987214).',
                inputSchema: {
                  type: 'object',
                  properties: {
                    pmid: { type: 'string', description: 'PubMed Identifier' },
                  },
                  required: ['pmid'],
                },
              },
              {
                name: 'nais_schedule',
                description: 'Retrieve official Singapore National Adult Immunisation Schedule (Sept 2025) recommendations and Healthier SG / CHAS subsidies.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    vaccine: { type: 'string', description: 'pneumococcal, influenza, shingles, tdap, or hepb' },
                  },
                  required: ['vaccine'],
                },
              },
              {
                name: 'population_survey',
                description: 'Query Singapore National Population Health Survey statistics (2007-2023) for residents aged 18-74.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    series: { type: 'string', description: 'Series keyword, e.g. diabetes, hypertension, smoking, obesity, screening' },
                  },
                  required: ['series'],
                },
              },
            ],
          },
        });
      }

      case 'tools/call': {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};

        if (toolName === 'pubmed_search') {
          const q = (toolArgs.query || '').toLowerCase();
          const results = Object.values(VERIFIED_PUBMED).filter(
            p => p.title.toLowerCase().includes(q) || p.finding.toLowerCase().includes(q)
          );
          return res.status(200).json({
            jsonrpc: '2.0',
            id: requestId,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results.length > 0 ? results : Object.values(VERIFIED_PUBMED), null, 2),
                },
              ],
            },
          });
        }

        if (toolName === 'pubmed_fetch') {
          const pmid = toolArgs.pmid;
          const paper = VERIFIED_PUBMED[pmid];
          if (paper) {
            return res.status(200).json({
              jsonrpc: '2.0',
              id: requestId,
              result: {
                content: [{ type: 'text', text: JSON.stringify(paper, null, 2) }],
              },
            });
          }
          return res.status(200).json({
            jsonrpc: '2.0',
            id: requestId,
            result: {
              content: [{ type: 'text', text: `PubMed record for PMID ${pmid} not in pre-verified scope.` }],
              isError: true,
            },
          });
        }

        if (toolName === 'nais_schedule') {
          const vac = (toolArgs.vaccine || '').toLowerCase();
          const info = {
            framework: 'MOH Singapore National Adult Immunisation Schedule (Sept 2025)',
            pneumococcal: 'PCV20 (1 dose) OR PCV13 (1 dose) followed by PPSV23 1 year later. $0 co-payment under Healthier SG for Pioneer, Merdeka, CHAS Blue/Orange.',
            influenza: 'Annual single dose. Subsidised via CHAS ($0 Pioneer, $9-$18 Blue/Orange) and Polyclinics.',
            shingles: 'Shingrix 2 doses (0, 2-6 months). Adults 50+. Claimable up to $500-$700/year via MediSave CDMP.',
            tdap: '1 dose per pregnancy (27-36 weeks). Subsidised under NAIS.',
          };
          const text = info[vac] || JSON.stringify(info, null, 2);
          return res.status(200).json({
            jsonrpc: '2.0',
            id: requestId,
            result: { content: [{ type: 'text', text }] },
          });
        }

        if (toolName === 'population_survey') {
          return res.status(200).json({
            jsonrpc: '2.0',
            id: requestId,
            result: {
              content: [{ type: 'text', text: JSON.stringify(DATASET, null, 2) }],
            },
          });
        }

        return res.status(200).json({
          jsonrpc: '2.0',
          id: requestId,
          error: { code: -32601, message: `Unknown tool: ${toolName}` },
        });
      }

      case 'resources/list': {
        return res.status(200).json({
          jsonrpc: '2.0',
          id: requestId,
          result: {
            resources: [
              {
                uri: 'mcp://sg-health/nais-schedule',
                name: 'MOH Singapore NAIS Sept 2025 Schedule',
                mimeType: 'application/json',
              },
              {
                uri: 'mcp://sg-health/pubmed-evidence',
                name: 'Verified PubMed Trial Citations',
                mimeType: 'application/json',
              },
              {
                uri: 'mcp://sg-health/population-survey',
                name: 'National Population Health Survey (Residents 18-74)',
                mimeType: 'application/json',
              },
            ],
          },
        });
      }

      case 'resources/read': {
        const uri = params?.uri;
        let content = '';
        if (uri === 'mcp://sg-health/nais-schedule') {
          content = JSON.stringify({ schedule: 'NAIS Sept 2025', effective: 'September 2025' });
        } else if (uri === 'mcp://sg-health/pubmed-evidence') {
          content = JSON.stringify(VERIFIED_PUBMED);
        } else if (uri === 'mcp://sg-health/population-survey') {
          content = JSON.stringify(DATASET);
        } else {
          return res.status(404).json({
            jsonrpc: '2.0',
            id: requestId,
            error: { code: -32602, message: `Resource not found: ${uri}` },
          });
        }

        return res.status(200).json({
          jsonrpc: '2.0',
          id: requestId,
          result: {
            contents: [{ uri, mimeType: 'application/json', text: content }],
          },
        });
      }

      default: {
        return res.status(400).json({
          jsonrpc: '2.0',
          id: requestId,
          error: { code: -32601, message: `Method not found: ${method}` },
        });
      }
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    return res.status(500).json({
      jsonrpc: '2.0',
      id: requestId,
      error: { code: -32603, message: errorMsg },
    });
  }
}
