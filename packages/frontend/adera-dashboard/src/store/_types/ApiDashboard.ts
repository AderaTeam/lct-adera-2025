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
  toneDynamics: {
    name: string;
    positive: number;
    negative: number;
    neutral: number;
  }[];
  avgReviews: number;
  maxReviewsData: {
    name: string;
    count: number;
  };
  anomalies: {
    positive: {
      amount: number;
      name: string;
    };
    negative: {
      amount: number;
      name: string;
    };
  };
}
