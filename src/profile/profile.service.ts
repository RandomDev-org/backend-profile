import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRepo.create(createProfileDto);
    return this.profileRepo.save(profile);
  }

  findAll(): Promise<Profile[]> {
    return this.profileRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findOne(id);
    const merged = this.profileRepo.merge(profile, updateProfileDto);
    return this.profileRepo.save(merged);
  }

  async remove(id: string): Promise<void> {
    const result = await this.profileRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }
}
