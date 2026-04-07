import { Body, Controller, Delete, HttpCode, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HabitLogsService } from './habit-logs.service';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { IHabitLogController } from './interfaces/habit-log.controller.interface';
import { CurrentUser } from '../decorators/current-user.decorator';
import { HabitLog } from './habit-log.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('habits/:habitId/check')
export class HabitLogsController implements IHabitLogController {
  constructor(private readonly habitLogsService: HabitLogsService) {}

  @Post()
  check(
    @CurrentUser() user: { id: number },
    @Param('habitId', ParseIntPipe) habitId: number,
    @Body() dto: CreateHabitLogDto,
  ): Promise<HabitLog> {
    return this.habitLogsService.check(user.id, habitId, dto);
  }

  @Delete()
  @HttpCode(204)
  uncheck(
    @CurrentUser() user: { id: number },
    @Param('habitId', ParseIntPipe) habitId: number,
    @Query('date') date: string,
  ): Promise<void> {
    return this.habitLogsService.uncheck(user.id, habitId, date);
  }
}