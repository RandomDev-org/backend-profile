import {
  Injectable,
  Inject,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  lastValueFrom,
  timeout,
  catchError,
  throwError,
  TimeoutError,
} from 'rxjs';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

export interface UserPreferences {
  userId: string;
  preferredGenres?: string[];
  preferredLocation?: string;
  latitude?: number;
  longitude?: number;
  preferredEventTypes?: string[];
}

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('DB_SERVICE')
    private readonly dbClient: ClientProxy,
  ) {}

  async getPreferences(userId: string): Promise<UserPreferences> {
    try {
      const prefs = await lastValueFrom(
        this.dbClient
          .send<UserPreferences>({ cmd: 'get_preferences' }, { userId })
          .pipe(
            timeout(5000),
            catchError((err: unknown) => throwError(() => err)),
          ),
      );
      if (!prefs) {
        throw new NotFoundException(`Preferences not found for user ${userId}`);
      }
      return prefs;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      if (err instanceof TimeoutError) {
        throw new RequestTimeoutException('DB service unavailable');
      }
      throw err;
    }
  }

  async updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<UserPreferences> {
    try {
      return await lastValueFrom(
        this.dbClient
          .send<UserPreferences>(
            { cmd: 'upsert_preferences' },
            { userId, ...dto },
          )
          .pipe(
            timeout(5000),
            catchError((err: unknown) => throwError(() => err)),
          ),
      );
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw new RequestTimeoutException('DB service unavailable');
      }
      throw err;
    }
  }
}
