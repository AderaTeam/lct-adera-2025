export class ToneSummaryDto {
  positive: number;
  negative: number;
  neutral: number;
}

export class TopicStatsDto {
  name: string;
  positive: number;
  negative: number;
  neutral: number;
}

export class DynamicsDto {
  name: string;
  count: number;
}

export class ToneDynamicsDto {
  name: string;
  positive: number;
  negative: number;
  neutral: number;
}

export class DashboardDto {
  summary: ToneSummaryDto;
  topics: TopicStatsDto[];
  dynamics: DynamicsDto[];
  toneDynamics: ToneDynamicsDto[];
  totalReviews: number;
  avgReviews: number;
}
