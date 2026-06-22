import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.profileService.remove(id);
  }

  @MessagePattern({ cmd: 'profile.create' })
  createTcp(data: CreateProfileDto) {
    return this.profileService.create(data);
  }

  @MessagePattern({ cmd: 'profile.findOne' })
  findOneTcp(data: { id: string }) {
    return this.profileService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'profile.update' })
  updateTcp(data: { id: string; dto: UpdateProfileDto }) {
    return this.profileService.update(data.id, data.dto);
  }
}
