export class FileAnalysisDetailDto {
  id: number;
  summary: ToneSummaryDto;
  topics: TopicStatsDto[];
}

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
