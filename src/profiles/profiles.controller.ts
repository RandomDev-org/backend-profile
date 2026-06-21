import { Controller, Get, Put, Param, Body } from '@nestjs/common';
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
}

// TODO: Endpoints de búsqueda de eventos serán implementados cuando se integre
// el microservicio "maps" vía API Gateway:
//   GET /profiles/events/search?genre=&eventType=&latitude=&longitude=&radiusKm=
//   GET /profiles/events
