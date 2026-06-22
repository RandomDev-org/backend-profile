import { IsString, IsIn, IsOptional, IsUUID } from 'class-validator';

export class CreateHistoryEntryDto {
  @IsString()
  @IsUUID()
  eventId: string;

  @IsString()
  @IsIn(['attendee', 'performer', 'organizer'])
  role: 'attendee' | 'performer' | 'organizer';

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
