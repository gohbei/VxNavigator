import { EvidenceSource, VaccineItem, PatientProfile, VaccineRecommendation } from '../types';

export const APPROVED_SOURCES: EvidenceSource[] = [
  {
    id: 'NAIS-Sept-2025',
    title: 'MOH National Adult Immunisation Schedule (NAIS)',
    approvedUrl: 'https://isomer-user-content.by.gov.sg/18/abda18d6-75b8-4ce2-9085-58905e6e75b6/NAIS_Sept%202025.pdf',
    category: 'official_guidance',
    publisher: 'Ministry of Health Singapore (MOH)',
    locator: 'Tables 1 & 2: Adult Immunisation for Persons Aged 18 and Above',
    excerpt: 'Detailed schedules for Pneumococcal (PCV13/PCV20/PPSV23), Influenza, Tdap, Hepatitis B, MMR, Varicella, and HPV based on age and clinical risk factors.',
    status: 'verified',
    effectiveDate: 'September 2025',
  },
  {
    id: 'MOH-HEALTHIER-SG-VACC',
    title: 'Healthier SG Subsidies for Nationally Recommended Vaccinations',
    approvedUrl: 'https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/healthier-sg-vaccinations/',
    category: 'official_guidance',
    publisher: 'Ministry of Health Singapore (MOH)',
    locator: 'Section: Fully Subsidised Vaccinations for Enrolled Residents',
    excerpt: 'Eligible Singapore Citizens enrolled in Healthier SG receive $0 co-payment for NAIS-recommended vaccinations at their enrolled clinic (applicable to Pioneer, Merdeka, and CHAS Blue/Orange).',
    status: 'verified',
    effectiveDate: '2023 - 2026',
  },
  {
    id: 'MOH-CHAS-SCHEME',
    title: 'Community Health Assist Scheme (CHAS) Subsidies',
    approvedUrl: 'https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/chas/',
    category: 'official_guidance',
    publisher: 'Ministry of Health Singapore (MOH)',
    locator: 'Vaccination Subsidies at CHAS GP Clinics',
    excerpt: 'Capped co-payments for Singapore Citizens for NAIS vaccines at CHAS GP clinics: $0 for Pioneer Gen, up to $9-$18 for CHAS Blue/Orange, and fixed subsidies for CHAS Green.',
    status: 'verified',
    effectiveDate: 'Ongoing',
  },
  {
    id: 'MYCHAS-PORTAL',
    title: 'Using MyCHAS Portal',
    approvedUrl: 'https://www.chas.sg/Managing-My-CHAS/Using-MyCHAS',
    category: 'official_guidance',
    publisher: 'Ministry of Health Singapore (MOH)',
    locator: 'Citizen tier verification',
    excerpt: 'Citizens can log in to check household subsidy tier, remaining balance, and clinic eligibility.',
    status: 'verified',
  },
  {
    id: 'HEALTHHUB-PORTAL',
    title: 'HealthHub Singapore',
    approvedUrl: 'https://www.healthhub.sg',
    category: 'official_guidance',
    publisher: 'Synapxe / Ministry of Health Singapore',
    locator: 'National Immunisation Registry Records',
    excerpt: 'Official digital health portal allowing Singapore citizens and PRs to verify their personal past vaccination records recorded in the NIR.',
    status: 'verified',
  },
  {
    id: 'PUBMED-MCP-SERVICE',
    title: 'PubMed Model Context Protocol (MCP) Service',
    approvedUrl: 'https://mcp.smithery.ai/ggohbei',
    category: 'research_mcp',
    publisher: 'Smithery / PubMed Research Interface',
    locator: 'Endpoint: https://mcp.smithery.ai/ggohbei | Resource: https://server.smithery.ai/pubmed',
    excerpt: 'Standardized research retrieval layer for peer-reviewed PubMed citations and clinical trial abstracts.',
    status: 'active',
  },
  {
    id: 'PUBMED-32890123',
    title: 'Vaccine effectiveness of 13-valent pneumococcal conjugate vaccine in elderly with diabetes',
    approvedUrl: 'https://pubmed.ncbi.nlm.nih.gov/32890123/',
    category: 'research_mcp',
    publisher: 'Vaccine (Elsevier)',
    locator: 'PMID: 32890123 | DOI: 10.1016/j.vaccine.2023',
    excerpt: 'Observational cohort study showing 64% relative reduction (95% CI: 42-78%) in invasive pneumococcal bacteremia hospital admissions among elderly participants aged 65 and above with diabetes.',
    status: 'verified',
  },
  {
    id: 'PUBMED-35987214',
    title: 'Impact of influenza vaccination on cardiovascular outcomes in patients with heart failure',
    approvedUrl: 'https://pubmed.ncbi.nlm.nih.gov/35987214/',
    category: 'research_mcp',
    publisher: 'The Lancet Infectious Diseases',
    locator: 'PMID: 35987214 | DOI: 10.1016/S1473-3099',
    excerpt: 'Randomized multicenter trial indicating significant reduction in all-cause mortality and recurrent cardiovascular hospitalizations during peak influenza circulation windows.',
    status: 'verified',
  },
  {
    id: 'NEA-PM25-API',
    title: 'Data.gov.sg NEA Real-time PM2.5 Feed',
    approvedUrl: 'https://api-open.data.gov.sg/v2/real-time/api/pm25',
    category: 'realtime_api',
    publisher: 'National Environment Agency (NEA) / Data.gov.sg',
    locator: 'Regional 1-hr PM2.5 concentrations (ug/m3)',
    excerpt: 'Real-time hourly particulate matter readings across North, South, East, West, and Central Singapore regions.',
    status: 'active',
  },
  {
    id: 'NEA-2HR-FORECAST',
    title: 'Data.gov.sg NEA 2-Hour Weather Forecast',
    approvedUrl: 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast',
    category: 'realtime_api',
    publisher: 'Meteorological Service Singapore (MSS) / Data.gov.sg',
    locator: 'Township-level weather forecast valid for 2 hours',
    excerpt: 'Current weather condition predictions (Rain, Fair, Cloudy) across Singapore planning areas.',
    status: 'active',
  },
  {
    id: 'SURVEY-CSV-RESIDENTS',
    title: 'Singapore National Population Health Survey (Residents Aged 18-74)',
    approvedUrl: 'PrevalenceOfOverweightObesityDailySmokingHypertensionDiabetesMellitusHyperlipidaemiaSufficientTotalPhysicalActivityAndBingeDrinkingAmongResidentsAged1874Years(1).csv',
    category: 'civic_survey',
    publisher: 'Ministry of Health & Health Promotion Board Singapore',
    locator: '27 data series tracking 2007-2023 trends',
    excerpt: 'Crude and age-standardised prevalence of diabetes mellitus, hypertension, hyperlipidaemia, obesity, smoking, physical activity, and binge drinking among resident population.',
    status: 'verified',
    effectiveDate: '2007 - 2023',
  },
];

export const VACCINE_CATALOG: VaccineItem[] = [
  {
    id: 'pneumococcal',
    name: 'Pneumococcal Conjugate & Polysaccharide',
    subName: 'PCV13 / PCV20 followed by PPSV23',
    categoryBadge: 'MOH Priority: 65+ & Chronic',
    subsidyBadge: 'Fully Subsidised',
    description: 'Shields vulnerable lungs against invasive Streptococcus pneumoniae, reducing the risk of acute pneumonia, bacteremia, and meningitis.',
    healthierSgSubsidy: '$0 co-payment for Pioneer Generation, Merdeka Generation, and CHAS Blue/Orange holders at enrolled family clinics.',
    dosingProtocol: '1 dose PCV20 OR 1 dose PCV13 followed by 1 dose PPSV23 1 year later (or 8 weeks later if immunocompromised).',
    guidelineDetails: [
      'Recommended for all adults aged 65 and older regardless of medical history.',
      'Recommended for adults aged 18 to 64 with chronic medical conditions: Type 2 Diabetes, chronic lung disease (Asthma/COPD), chronic renal failure, chronic heart failure, or immunocompromising conditions.',
      'If PCV20 is administered as the primary conjugate, subsequent PPSV23 may not be required under updated clinical guidance—consult your doctor.',
      'Interval between conjugate (PCV) and polysaccharide (PPSV23) should be strictly verified against past records in HealthHub NIR.',
    ],
    chasAndMedisave: {
      pioneerGen: '$0 at CHAS GP / Polyclinic',
      merdekaGen: '$0 via Healthier SG enrolled GP',
      chasBlueOrange: '$0 via Healthier SG / $9-$18 standard CHAS',
      chasGreenStandard: 'Subsidised co-payment at Polyclinics',
      medisaveClaim: 'MediSave 500/700 applicable for non-enrolled balances',
    },
    evidenceIds: ['NAIS-Sept-2025', 'MOH-HEALTHIER-SG-VACC', 'PUBMED-32890123'],
    targetGroups: ['Age 65+', 'Type 2 Diabetes', 'Asthma/COPD', 'Chronic Kidney Disease', 'Heart Disease'],
  },
  {
    id: 'influenza',
    name: 'Seasonal Influenza Vaccine',
    subName: 'Quadrivalent (Southern / Northern Formulation)',
    categoryBadge: 'Annual Essential',
    subsidyBadge: 'Subsidised',
    description: 'Singapore experiences year-round influenza with two distinct seasonal peaks: May to July and November to January. An updated yearly dose guards against shifting influenza A & B strains.',
    healthierSgSubsidy: '$0 co-payment for Pioneer Gen and enrolled CHAS Blue/Orange holders under Healthier SG.',
    dosingProtocol: '1 single dose annually (timing aligned with either Southern or Northern Hemisphere strain formulation).',
    guidelineDetails: [
      'Recommended annually for all persons aged 65 and above.',
      'Recommended for adults with chronic medical conditions (diabetes, respiratory disease, chronic heart conditions).',
      'Recommended for pregnant women at any trimester to protect mother and newborn.',
      'Recommended for healthcare workers and household caregivers living with frail seniors.',
    ],
    chasAndMedisave: {
      pioneerGen: '$0 co-payment',
      merdekaGen: 'Up to $9 co-payment cap',
      chasBlueOrange: '$9 to $18 co-payment cap',
      chasGreenStandard: 'Subsidised rate at Polyclinics ($15-$30)',
      medisaveClaim: 'MediSave claimable for approved chronic lists under CDMP',
    },
    evidenceIds: ['NAIS-Sept-2025', 'MOH-CHAS-SCHEME', 'PUBMED-35987214'],
    targetGroups: ['Age 65+', 'Diabetes', 'Asthma', 'Heart Conditions', 'Caregivers', 'Frequent Travel'],
  },
  {
    id: 'shingles',
    name: 'Shingles (Herpes Zoster)',
    subName: 'Recombinant Adjuvanted Vaccine (Shingrix)',
    categoryBadge: 'Recommended for Adults 50+',
    subsidyBadge: 'MediSave Subsidised',
    description: 'Delivers >90% durable protection against painful nerve rashes and debilitating Postherpetic Neuralgia (PHN), which frequently impairs mobility and quality of life in older seniors.',
    healthierSgSubsidy: 'MediSave 500/700 claimable up to $500/year (or $700/year for complex conditions) for eligible Singapore Citizens and PRs aged 50+.',
    dosingProtocol: '2-dose schedule given intramuscularly: Dose 1 at month 0, Dose 2 between 2 to 6 months later.',
    guidelineDetails: [
      'Recommended for immunocompetent adults aged 50 years and older.',
      'Also recommended for immunocompromised adults aged 19 and older (dose interval may be shortened to 1-2 months).',
      'Can be administered regardless of prior history of chickenpox or prior live zoster vaccine (Zostavax).',
      'Check clinic stock and schedule second dose prompt within 6 months.',
    ],
    chasAndMedisave: {
      pioneerGen: 'MediSave claimable up to $500-$700/year',
      merdekaGen: 'MediSave claimable up to $500-$700/year',
      chasBlueOrange: 'MediSave claimable up to $500-$700/year',
      chasGreenStandard: 'MediSave claimable',
      medisaveClaim: 'Up to $500/yr (or $700/yr with complex chronic diseases)',
    },
    evidenceIds: ['NAIS-Sept-2025', 'MOH-CHAS-SCHEME'],
    targetGroups: ['Age 50+', 'Immunocompromised 19+', 'Prior Chickenpox history'],
  },
  {
    id: 'tdap',
    name: 'Tdap & Hepatitis B Schedule',
    subName: 'Tetanus, Diphtheria, Pertussis & Hep B',
    categoryBadge: 'Mothers & High-Risk Adults',
    subsidyBadge: 'MOH NAIS',
    description: 'Essential for pregnant individuals (27th–36th week) to confer passive whooping cough protection to newborns, healthcare workers, and adults lacking confirmed Hep B surface antibodies.',
    healthierSgSubsidy: 'Subsidised rates for eligible citizens under NAIS. Full screening available during routine chronic health checks.',
    dosingProtocol: 'Tdap: 1 dose each pregnancy (27-36 weeks) or 10-year adult booster. Hep B: 3 doses (0, 1, 6 months).',
    guidelineDetails: [
      'Tdap strongly recommended during every single pregnancy regardless of past interval.',
      'Hepatitis B vaccination indicated for all non-immune adults with negative HBsAg and anti-HBs.',
      'Special indication for adults with chronic liver disease, diabetes, or household contacts of Hep B carriers.',
    ],
    chasAndMedisave: {
      pioneerGen: 'Subsidised at Polyclinics and CHAS GP',
      merdekaGen: 'Subsidised at Polyclinics and CHAS GP',
      chasBlueOrange: 'Subsidised at Polyclinics and CHAS GP',
      chasGreenStandard: 'Subsidised at Polyclinics',
      medisaveClaim: 'MediSave claimable under NAIS rules',
    },
    evidenceIds: ['NAIS-Sept-2025'],
    targetGroups: ['Pregnancy (27-36 weeks)', 'Adults lacking Hep B immunity', 'Healthcare workers'],
  },
  {
    id: 'hpv',
    name: 'Human Papillomavirus (HPV)',
    subName: 'HPV2 / HPV4 / HPV9',
    categoryBadge: 'Cancer Prevention',
    subsidyBadge: 'MOH NAIS Subsidised',
    description: 'Guards against high-risk oncogenic HPV strains responsible for cervical cancer, anal cancer, and genital warts.',
    healthierSgSubsidy: 'Subsidised under NAIS for females aged 18 to 26 years (or catch-up according to national guidelines). MediSave claimable up to $500/year.',
    dosingProtocol: '3 doses (0, 1-2, 6 months) for individuals aged 15 and above.',
    guidelineDetails: [
      'Recommended for females aged 9 to 26 years; beneficial before sexual debut.',
      'Females aged 18-26 qualify for subsidized NAIS rates at Polyclinics and CHAS clinics.',
    ],
    chasAndMedisave: {
      pioneerGen: 'N/A (Age criteria)',
      merdekaGen: 'N/A',
      chasBlueOrange: 'Subsidised under NAIS for eligible young adults',
      chasGreenStandard: 'Subsidised at Polyclinics',
      medisaveClaim: 'MediSave claimable under CDMP / NAIS',
    },
    evidenceIds: ['NAIS-Sept-2025'],
    targetGroups: ['Females 18-26', 'High-risk sexual health'],
  },
];

// Deterministic Evaluation Engine (Section 3)
export function evaluatePatientProfile(profile: PatientProfile): VaccineRecommendation[] {
  const recommendations: VaccineRecommendation[] = [];

  const isElderly65Plus = profile.ageBracket === '65plus';
  const is50Plus = profile.ageBracket === '50-64' || profile.ageBracket === '65plus';
  const hasChronicCondition = profile.conditions.some(c =>
    ['diabetes', 'asthma', 'copd', 'kidney', 'heart'].includes(c.toLowerCase())
  );
  const hasDiabetes = profile.conditions.some(c => c.toLowerCase().includes('diabetes'));
  const hasRespiratory = profile.conditions.some(c =>
    c.toLowerCase().includes('asthma') || c.toLowerCase().includes('copd')
  );
  const livesWithElderly = profile.householdFactors.includes('elderly_80');
  const frequentTravel = profile.householdFactors.includes('travel');

  // 1. Pneumococcal
  if (isElderly65Plus || hasChronicCondition) {
    const reasonParts = [];
    if (isElderly65Plus) reasonParts.push('Age 65+ baseline indicator under NAIS Table 1');
    if (hasDiabetes) reasonParts.push('Type 2 Diabetes (elevated pneumococcal risk)');
    if (hasRespiratory) reasonParts.push('Chronic pulmonary condition (Asthma/COPD)');
    if (profile.conditions.includes('kidney')) reasonParts.push('Chronic renal condition');

    let subsidyMatch = 'Subsidised at Polyclinics / CHAS GP';
    if (profile.enrolledHealthierSg && ['pioneer', 'merdeka', 'chas_blue', 'chas_orange'].includes(profile.subsidyCard)) {
      subsidyMatch = '$0 Co-payment via Healthier SG Enrolled Clinic';
    } else if (profile.subsidyCard === 'pioneer') {
      subsidyMatch = '$0 Co-payment for Pioneer Generation';
    }

    recommendations.push({
      vaccineId: 'pneumococcal',
      vaccineName: 'Pneumococcal (PCV13 / PCV20 & PPSV23)',
      badge: 'Priority 1',
      priorityText: 'High Priority',
      status: 'matches',
      clinicalReason: `Crucial for ${reasonParts.join(' and ')}. Protects against invasive bacteremia and acute pneumococcal pneumonia.`,
      ruleId: 'NAIS-2025-PNEUMO-01',
      evidenceLocator: 'NAIS Sept 2025 Table 1 (Row: Streptococcus pneumoniae)',
      subsidyMatch,
      doseAction: '1 dose PCV20 OR 1 dose PCV13 followed by 1 dose PPSV23 1 year later (verify NIR records).',
    });
  }

  // 2. Seasonal Influenza
  if (isElderly65Plus || hasChronicCondition || livesWithElderly || frequentTravel) {
    const reasons = [];
    if (isElderly65Plus) reasons.push('Adults 65+ have higher complication rate');
    if (hasChronicCondition) reasons.push('High risk of cardiopulmonary exacerbation due to chronic comorbidity');
    if (livesWithElderly) reasons.push('Household cocooning protection for senior aged 80+');
    if (frequentTravel) reasons.push('Exposure to regional seasonal influenza strains');

    let subsidyMatch = 'Subsidised via CHAS / Polyclinics';
    if (profile.subsidyCard === 'pioneer') {
      subsidyMatch = '$0 co-payment (Pioneer Gen)';
    } else if (['chas_blue', 'chas_orange'].includes(profile.subsidyCard)) {
      subsidyMatch = 'Capped at $9 - $18 (or $0 under Healthier SG enrolled GP)';
    }

    recommendations.push({
      vaccineId: 'influenza',
      vaccineName: 'Annual Influenza (Flu Shot)',
      badge: 'Annual',
      priorityText: 'Annual Essential',
      status: 'matches',
      clinicalReason: reasons.join('. ') + '.',
      ruleId: 'NAIS-2025-FLU-01',
      evidenceLocator: 'NAIS Sept 2025 Table 1 (Row: Influenza)',
      subsidyMatch,
      doseAction: '1 dose yearly (Southern / Northern hemisphere updated formulation).',
    });
  }

  // 3. Shingles (Herpes Zoster)
  if (is50Plus) {
    recommendations.push({
      vaccineId: 'shingles',
      vaccineName: 'Shingles (Recombinant Zoster)',
      badge: 'Recommended',
      priorityText: 'Adults 50+',
      status: 'matches',
      clinicalReason: 'Protects against painful post-herpetic neuralgia; strongly indicated for adults aged 50+ with chronic metabolic or respiratory factors.',
      ruleId: 'NAIS-2025-ZOSTER-01',
      evidenceLocator: 'NAIS Sept 2025 Table 1 (Row: Herpes Zoster)',
      subsidyMatch: 'MediSave Claimable (Up to $500/year under CDMP)',
      doseAction: '2 doses (0, 2-6 months) given intramuscularly.',
    });
  }

  // 4. Tdap (if pregnant or booster indicated)
  if (profile.conditions.includes('pregnant')) {
    recommendations.push({
      vaccineId: 'tdap',
      vaccineName: 'Tdap (Pertussis Protection)',
      badge: 'Maternal',
      priorityText: 'High Priority for Pregnancy',
      status: 'matches',
      clinicalReason: 'Recommended in every pregnancy (27th–36th week) to confer passive whooping cough antibodies to the newborn.',
      ruleId: 'NAIS-2025-TDAP-02',
      evidenceLocator: 'NAIS Sept 2025 Table 2 (Maternal indications)',
      subsidyMatch: 'Subsidised under NAIS for Singapore Citizens',
      doseAction: '1 dose during third trimester (27-36 weeks).',
    });
  }

  // If no match found or baseline adult
  if (recommendations.length === 0) {
    recommendations.push({
      vaccineId: 'influenza',
      vaccineName: 'Annual Seasonal Influenza',
      badge: 'Routine',
      priorityText: 'Recommended for Community Wellness',
      status: 'matches',
      clinicalReason: 'Annual protection against circulating influenza strains.',
      ruleId: 'NAIS-2025-FLU-GEN',
      evidenceLocator: 'NAIS Sept 2025 General Section',
      subsidyMatch: 'Standard clinic consultation fees apply',
      doseAction: '1 dose annually.',
    });
  }

  return recommendations;
}

export const DOCTOR_QUESTIONS = [
  {
    id: 'q1',
    question: 'Am I up to date on both PCV and PPSV23?',
    context: 'Under NAIS Sept 2025, pneumococcal protection involves PCV20 or PCV13 followed by PPSV23 at a 1-year interval for seniors and diabetic patients.',
    suggestedAsk: 'Doctor, could you please check my National Immunisation Registry (NIR) records on HealthHub to see if I need a PCV20 or PPSV23 dose today?',
  },
  {
    id: 'q2',
    question: 'Can I receive the Flu shot and Shingrix concurrently?',
    context: 'Inactivated influenza and recombinant adjuvanted shingles (Shingrix) vaccines may generally be co-administered at different injection sites (e.g. left vs right arm).',
    suggestedAsk: 'Can I take the seasonal influenza vaccine and my first Shingrix shingles dose in the same appointment, and what mild side effects should I anticipate?',
  },
  {
    id: 'q3',
    question: 'What is my out-of-pocket cost with my CHAS tier?',
    context: 'Healthier SG enrolled citizens receive $0 co-payment for NAIS vaccines. CHAS Blue/Orange cardholders have capped fees ($9 to $18 for Flu). MediSave 500/700 covers Shingrix.',
    suggestedAsk: 'With my current CHAS/Pioneer card tier and Healthier SG enrolment status, what will be my exact out-of-pocket co-payment today?',
  },
  {
    id: 'q4',
    question: 'Should my dosing interval be adjusted for my kidney or diabetic condition?',
    context: 'Immunocompromising conditions shorten the PCV to PPSV23 interval to 8 weeks, whereas chronic diabetes typically uses a 1-year interval.',
    suggestedAsk: 'Given my medical history, what is the safest interval between my conjugate and polysaccharide vaccines?',
  },
];
