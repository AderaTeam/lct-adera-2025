export interface ApiDashboard {
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
  dynamics: {
    name: string;
    count: number;
  }[];
}
