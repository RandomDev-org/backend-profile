import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';
import { HistoryEntry } from './entities/history-entry.entity';
import { CreateHistoryEntryDto } from './dto/create-history-entry.dto';
import { HistoryQueryDto } from './dto/history-query.dto';

export interface HistoryStats {
  total: number;
  byRole: Record<string, number>;
  byGenre: Record<string, number>;
}

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntry)
    private readonly historyRepo: Repository<HistoryEntry>,
  ) {}

  async getUserHistory(
    userId: string,
    query: HistoryQueryDto,
  ): Promise<{ data: HistoryEntry[]; total: number }> {
    const where: FindOptionsWhere<HistoryEntry> = { userId };

    if (query.role) {
      where.role = query.role;
    }

    if (query.genre) {
      where.genre = query.genre;
    }

    if (query.from || query.to) {
      where.createdAt = Between(
        query.from ? new Date(query.from) : new Date(0),
        query.to ? new Date(query.to) : new Date(),
      );
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [data, total] = await this.historyRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async addEntry(
    userId: string,
    dto: CreateHistoryEntryDto,
  ): Promise<HistoryEntry> {
    const entry = this.historyRepo.create({ userId, ...dto });
    return this.historyRepo.save(entry);
  }

  async deleteEntry(userId: string, entryId: string): Promise<void> {
    const result = await this.historyRepo.delete({ id: entryId, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`History entry ${entryId} not found`);
    }
  }

  async getStats(userId: string): Promise<HistoryStats> {
    const total = await this.historyRepo.count({ where: { userId } });

    const byRoleRaw: Array<{ role: string; count: string }> =
      await this.historyRepo
        .createQueryBuilder('h')
        .select('h.role', 'role')
        .addSelect('COUNT(*)', 'count')
        .where('h.userId = :userId', { userId })
        .groupBy('h.role')
        .getRawMany();

    const byRole: Record<string, number> = {};
    for (const row of byRoleRaw) {
      byRole[row.role] = Number(row.count);
    }

    const byGenreRaw: Array<{ genre: string; count: string }> =
      await this.historyRepo
        .createQueryBuilder('h')
        .select('h.genre', 'genre')
        .addSelect('COUNT(*)', 'count')
        .where('h.userId = :userId', { userId })
        .andWhere('h.genre IS NOT NULL')
        .groupBy('h.genre')
        .getRawMany();

    const byGenre: Record<string, number> = {};
    for (const row of byGenreRaw) {
      byGenre[row.genre] = Number(row.count);
    }

    return { total, byRole, byGenre };
  }
}
