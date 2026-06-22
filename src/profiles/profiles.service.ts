import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UserPreference)
    private readonly preferenceRepo: Repository<UserPreference>,
  ) {}

  async getPreferences(userId: string): Promise<UserPreference> {
    const prefs = await this.preferenceRepo.findOne({ where: { userId } });
    if (!prefs) {
      throw new NotFoundException(`Preferences not found for user ${userId}`);
    }
    return prefs;
  }

  async updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<UserPreference> {
    let prefs = await this.preferenceRepo.findOne({ where: { userId } });
    if (!prefs) {
      prefs = this.preferenceRepo.create({ userId });
    }
    if (dto.preferredGenres !== undefined) {
      prefs.preferredGenres = dto.preferredGenres;
    }
    if (dto.preferredLocation !== undefined) {
      prefs.preferredLocation = dto.preferredLocation;
    }
    if (dto.latitude !== undefined) {
      prefs.latitude = dto.latitude;
    }
    if (dto.longitude !== undefined) {
      prefs.longitude = dto.longitude;
    }
    if (dto.preferredEventTypes !== undefined) {
      prefs.preferredEventTypes = dto.preferredEventTypes;
    }
    return this.preferenceRepo.save(prefs);
  }
}
