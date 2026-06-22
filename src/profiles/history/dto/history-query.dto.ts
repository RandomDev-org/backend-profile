import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HistoryQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['attendee', 'performer', 'organizer'])
  role?: 'attendee' | 'performer' | 'organizer';

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}
