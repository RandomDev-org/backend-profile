import { IsString, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PreferencesDto } from './create-profile.dto';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ValidateNested()
  @Type(() => PreferencesDto)
  @IsOptional()
  preferences?: PreferencesDto;
}
