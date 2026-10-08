export type ScreenTab = 'home' | 'guide' | 'vaccines' | 'evidence';

export interface EvidenceSource {
  id: string;
  title: string;
  approvedUrl: string;
  category: 'official_guidance' | 'realtime_api' | 'research_mcp' | 'civic_survey';
  publisher: string;
  locator: string;
  excerpt: string;
  status: 'verified' | 'unverified' | 'active' | 'unavailable';
  lastChecked?: string;
  effectiveDate?: string;
}

export interface VaccineItem {
  id: string;
  name: string;
  subName: string;
  categoryBadge: string;
  subsidyBadge: string;
  description: string;
  healthierSgSubsidy: string;
  dosingProtocol: string;
  guidelineDetails: string[];
  chasAndMedisave: {
    pioneerGen?: string;
    merdekaGen?: string;
    chasBlueOrange?: string;
    chasGreenStandard?: string;
    medisaveClaim?: string;
  };
  evidenceIds: string[];
  targetGroups: string[];
}

export interface PatientProfile {
  ageBracket: 'under50' | '50-64' | '65plus';
  exactAge?: number;
  conditions: string[];
  householdFactors: string[];
  residency: 'citizen' | 'pr' | 'foreigner';
  subsidyCard: 'pioneer' | 'merdeka' | 'chas_blue' | 'chas_orange' | 'chas_green' | 'none';
  enrolledHealthierSg: boolean;
}

export type EvaluationMatchStatus = 'matches' | 'does_not_match' | 'insufficient_info';

export interface VaccineRecommendation {
  vaccineId: string;
  vaccineName: string;
  badge: string;
  priorityText: string;
  status: EvaluationMatchStatus;
  clinicalReason: string;
  ruleId: string;
  evidenceLocator: string;
  subsidyMatch: string;
  doseAction: string;
  contraindicationsNote?: string;
}

export interface AssistantClaim {
  claimId: string;
  text: string;
  evidenceIds: string[];
  status: 'supported' | 'insufficient' | 'conflicting';
}

export interface AssistantSource {
  id: string;
  title: string;
  url: string;
}

export interface AssistantResponse {
  answer: string;
  claims: AssistantClaim[];
  sources: AssistantSource[];
  dataAsOf: string;
  missingInformation: string[];
  limitations: string[];
}

export interface CSVRowRecord {
  dataSeries: string;
  yearlyValues: Record<string, number | null>;
  latestYear: string;
  latestValue: number | null;
  baselineYear: string;
  baselineValue: number | null;
  percentagePointChange: number | null;
}
