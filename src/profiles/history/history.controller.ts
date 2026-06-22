import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { HistoryService } from './history.service';
import { CreateHistoryEntryDto } from './dto/create-history-entry.dto';
import { HistoryQueryDto } from './dto/history-query.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':userId')
  getUserHistory(
    @Param('userId') userId: string,
    @Query() query: HistoryQueryDto,
  ) {
    return this.historyService.getUserHistory(userId, query);
  }

  @Post(':userId')
  addEntry(
    @Param('userId') userId: string,
    @Body() dto: CreateHistoryEntryDto,
  ) {
    return this.historyService.addEntry(userId, dto);
  }

  @Delete(':userId/:entryId')
  deleteEntry(
    @Param('userId') userId: string,
    @Param('entryId') entryId: string,
  ) {
    return this.historyService.deleteEntry(userId, entryId);
  }

  @Get(':userId/stats')
  getStats(@Param('userId') userId: string) {
    return this.historyService.getStats(userId);
  }

  @MessagePattern({ cmd: 'get_user_history' })
  getUserHistoryTcp(data: { userId: string } & HistoryQueryDto) {
    const { userId, ...query } = data;
    return this.historyService.getUserHistory(userId, query);
  }

  @MessagePattern({ cmd: 'add_history_entry' })
  addEntryTcp(data: { userId: string } & CreateHistoryEntryDto) {
    const { userId, ...dto } = data;
    return this.historyService.addEntry(userId, dto);
  }

  @MessagePattern({ cmd: 'delete_history_entry' })
  deleteEntryTcp(data: { userId: string; entryId: string }) {
    return this.historyService.deleteEntry(data.userId, data.entryId);
  }

  @MessagePattern({ cmd: 'get_user_history_stats' })
  getStatsTcp(data: { userId: string }) {
    return this.historyService.getStats(data.userId);
  }
}
