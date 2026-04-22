import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { IHabitController } from './interfaces/habit.controller.interface';
import { CurrentUser } from '../decorators/current-user.decorator';
import { HabitStatus } from './habit-status.enum';
import { Habit } from './habit.entity';
import { HabitResponse } from './interfaces/habit-response.interface';

@UseGuards(AuthGuard('jwt'))
@Controller('habits')
export class HabitsController implements IHabitController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  findAll(
    @CurrentUser() user: { id: number },
    @Query('status') status: HabitStatus = HabitStatus.ACTIVE,
    @Query('today') today: string,
  ): Promise<HabitResponse[]> {
    return this.habitsService.findAll(user.id, status, today);
  }

  @Get('search')
  findByName(
    @CurrentUser() user: { id: number },
    @Query('name') name: string,
  ): Promise<Habit[]> {
    return this.habitsService.findByName(user.id, name);
  }

  @Post()
  create(
    @CurrentUser() user: { id: number },
    @Body() dto: CreateHabitDto,
  ): Promise<Habit> {
    return this.habitsService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) habitId: number,
    @Body() dto: UpdateHabitDto,
  ): Promise<Habit> {
    return this.habitsService.update(user.id, habitId, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) habitId: number,
    @Body('status') status: HabitStatus,
  ): Promise<void> {
    return this.habitsService.updateStatus(user.id, habitId, status);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @CurrentUser() user: { id: number },
    @Param('id', ParseIntPipe) habitId: number,
  ): Promise<void> {
    return this.habitsService.remove(user.id, habitId);
  }
}