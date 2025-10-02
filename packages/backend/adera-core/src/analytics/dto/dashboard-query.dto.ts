import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DashboardQueryDto {
  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  @IsNumber({}, { each: true })
  sources?: number[];

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  @IsNumber({}, { each: true })
  topics?: number[];
}
