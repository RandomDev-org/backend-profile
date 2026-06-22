import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { ProfilesModule } from './profiles/profiles.module';
import { HistoryModule } from './profiles/history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProfileModule,
    ProfilesModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
