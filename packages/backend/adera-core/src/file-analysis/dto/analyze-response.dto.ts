export class PredictionDto {
  id: number;
  topics: string[];
  sentiments: string[];
}

export class AnalyzeResponseDto {
  predictions: PredictionDto[];
}
