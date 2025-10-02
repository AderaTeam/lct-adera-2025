import { IsOptional } from 'class-validator';

export class FileAnalysisQueryDto {
  @IsOptional()
  topics?: string;
}
