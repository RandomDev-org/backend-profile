import { IsString, IsEmail, IsArray, IsNotEmpty, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsOptional()
  address?: string;
}

export class PreferencesDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  genres: string[];

  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  preferredEventTypes: string[];
}

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @Type(() => PreferencesDto)
  @IsNotEmpty()
  preferences: PreferencesDto;
}
