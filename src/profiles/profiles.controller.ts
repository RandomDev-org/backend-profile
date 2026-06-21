import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProfilesService } from './profiles.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId/preferences')
  getPreferences(@Param('userId') userId: string) {
    return this.profilesService.getPreferences(userId);
  }

  @Put(':userId/preferences')
  updatePreferences(
    @Param('userId') userId: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.profilesService.updatePreferences(userId, dto);
  }

  @MessagePattern({ cmd: 'get_user_preferences' })
  getPreferencesTcp(data: { userId: string }) {
    return this.profilesService.getPreferences(data.userId);
  }

  @MessagePattern({ cmd: 'update_user_preferences' })
  updatePreferencesTcp(data: { userId: string } & UpdatePreferencesDto) {
    const { userId, ...dto } = data;
    return this.profilesService.updatePreferences(userId, dto);
  }
}
