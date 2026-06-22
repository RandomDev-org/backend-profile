import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  lastValueFrom,
  timeout,
  catchError,
  throwError,
  TimeoutError,
} from 'rxjs';
import { CreateHistoryEntryDto } from './dto/create-history-entry.dto';
import { HistoryQueryDto } from './dto/history-query.dto';

export interface HistoryEntry {
  id: string;
  userId: string;
  eventId: string;
  role: 'attendee' | 'performer' | 'organizer';
  notes?: string;
  createdAt: string;
}

export interface HistoryStats {
  total: number;
  byRole: Record<string, number>;
  byGenre: Record<string, number>;
}

@Injectable()
export class HistoryService {
  constructor(
    @Inject('MAPS_SERVICE')
    private readonly mapsClient: ClientProxy,
  ) {}

  async getUserHistory(
    userId: string,
    query: HistoryQueryDto,
  ): Promise<{ data: HistoryEntry[]; total: number }> {
    try {
      return await lastValueFrom(
        this.mapsClient
          .send<{
            data: HistoryEntry[];
            total: number;
          }>({ cmd: 'get_user_history' }, { userId, ...query })
          .pipe(
            timeout(5000),
            catchError((err: unknown) => throwError(() => err)),
          ),
      );
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw new Error('Maps service unavailable');
      }
      throw err;
    }
  }

  async addEntry(
    userId: string,
    dto: CreateHistoryEntryDto,
  ): Promise<HistoryEntry> {
    try {
      return await lastValueFrom(
        this.mapsClient
          .send<HistoryEntry>({ cmd: 'add_history_entry' }, { userId, ...dto })
          .pipe(
            timeout(5000),
            catchError((err: unknown) => throwError(() => err)),
          ),
      );
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw new Error('Maps service unavailable');
      }
      throw err;
    }
  }

  async deleteEntry(userId: string, entryId: string): Promise<void> {
    try {
      await lastValueFrom(
        this.mapsClient
          .send<void>({ cmd: 'delete_history_entry' }, { userId, entryId })
          .pipe(
            timeout(5000),
            catchError((err: unknown) => throwError(() => err)),
          ),
      );
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw new Error('Maps service unavailable');
      }
      throw err;
    }
  }

  async getStats(userId: string): Promise<HistoryStats> {
    try {
      return await lastValueFrom(
        this.mapsClient
          .send<HistoryStats>({ cmd: 'get_user_history_stats' }, { userId })
          .pipe(
            timeout(5000),
            catchError((err: unknown) => throwError(() => err)),
          ),
      );
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw new Error('Maps service unavailable');
      }
      throw err;
    }
  }
}
