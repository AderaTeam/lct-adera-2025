export interface ApiFileAnalysisDetail {
  id: string;
  summary: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topics: {
    name: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
}
