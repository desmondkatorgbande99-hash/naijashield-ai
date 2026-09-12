
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskIndicator {
  title: string;
  description: string;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number;
  riskSummary: string;
  category: string;
  indicators: RiskIndicator[];
  aiExplanation: string;
  recommendations: string[];
}

export type AnalysisType = 'message' | 'link' | 'screenshot';

export interface ReportNavigationState {
  type: AnalysisType;
  content: string;
  result?: AnalysisResult;
}