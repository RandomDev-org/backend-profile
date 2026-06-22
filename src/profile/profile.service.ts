import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from './profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ProfileService {
  private profiles: Map<string, Profile> = new Map();

  create(createProfileDto: CreateProfileDto): Profile {
    const id = randomUUID();
    const now = new Date();
    const profile: Profile = {
      id,
      ...createProfileDto,
      createdAt: now,
      updatedAt: now,
    };
    this.profiles.set(id, profile);
    return profile;
  }

  findAll(): Profile[] {
    return Array.from(this.profiles.values());
  }

  findOne(id: string): Profile {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  update(id: string, updateProfileDto: UpdateProfileDto): Profile {
    const profile = this.findOne(id);
    const updatedProfile: Profile = {
      ...profile,
      ...updateProfileDto,
      preferences: updateProfileDto.preferences
        ? {
            ...profile.preferences,
            ...updateProfileDto.preferences,
            location: updateProfileDto.preferences.location
              ? {
                  ...profile.preferences.location,
                  ...updateProfileDto.preferences.location,
                }
              : profile.preferences.location,
          }
        : profile.preferences,
      updatedAt: new Date(),
    };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  remove(id: string): void {
    const profile = this.findOne(id);
    this.profiles.delete(profile.id);
  }
}
