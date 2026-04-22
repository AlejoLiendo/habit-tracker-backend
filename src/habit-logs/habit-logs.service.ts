import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HabitsService } from '../habits/habits.service';
import { IHabitLogService, StreakResult } from './interfaces/habit-log.service.interface';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { HabitLog } from './habit-log.entity';
import { Frequency } from '../habits/frequency.enum';
import { HabitLogRepository } from './habit-log.repository';

@Injectable()
export class HabitLogsService implements IHabitLogService {
  constructor(
  private readonly habitLogRepository: HabitLogRepository,
  @Inject(forwardRef(() => HabitsService))
  private readonly habitsService: HabitsService,
) {}

  async check(userId: number, habitId: number, dto: CreateHabitLogDto): Promise<HabitLog> {
    await this.habitsService.findOneOrFail(userId, habitId);

    const existing = await this.habitLogRepository.findByHabitIdAndDate(habitId, dto.date);
    if (existing) throw new ConflictException('Ya marcaste este hábito hoy');

    return this.habitLogRepository.create(habitId, dto);
  }

  async uncheck(userId: number, habitId: number, date: string): Promise<void> {
    await this.habitsService.findOneOrFail(userId, habitId);

    const log = await this.habitLogRepository.findByHabitIdAndDate(habitId, date);
    if (!log) throw new NotFoundException('No existe un check para ese día');

    await this.habitLogRepository.delete(habitId, date);
  }

  async isCheckedOnDate(habitId: number, date: string): Promise<boolean> {
    const log = await this.habitLogRepository.findByHabitIdAndDate(habitId, date);
    return !!log;
  }

  async getStreak(habitId: number, frequency: string): Promise<StreakResult> {
    const logs = await this.habitLogRepository.findByHabitId(habitId);
    if (logs.length === 0) return { current: 0, max: 0 };

    const dates = logs.map((l) => l.date);

    if (frequency === Frequency.DAILY) {
      return this.calculateDailyStreak(dates);
    } else {
      return this.calculateWeeklyStreak(dates);
    }
  }

  private calculateDailyStreak(dates: string[]): StreakResult {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = this.offsetDate(today, -1);

    const lastDate = dates[dates.length - 1];
    const startsFrom = lastDate === today ? today : lastDate === yesterday ? yesterday : null;

    let current = 0;
    if (startsFrom) {
      let cursor = startsFrom;
      while (dates.includes(cursor)) {
        current++;
        cursor = this.offsetDate(cursor, -1);
      }
    }

    let max = 0;
    let temp = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = this.daysDiff(dates[i - 1], dates[i]);
      if (diff === 1) {
        temp++;
      } else {
        max = Math.max(max, temp);
        temp = 1;
      }
    }
    max = Math.max(max, temp);

    return { current, max };
  }

  private calculateWeeklyStreak(dates: string[]): StreakResult {
    const weeks = [...new Set(dates.map((d) => this.getWeekKey(d)))];

    const todayWeek = this.getWeekKey(new Date().toISOString().split('T')[0]);
    const lastWeek = this.getWeekKey(this.offsetDate(new Date().toISOString().split('T')[0], -7));

    const lastCheckedWeek = weeks[weeks.length - 1];
    const startsFrom = lastCheckedWeek === todayWeek ? todayWeek : lastCheckedWeek === lastWeek ? lastWeek : null;

    let current = 0;
    if (startsFrom) {
      let cursorDate = new Date().toISOString().split('T')[0];
      let cursorWeek = this.getWeekKey(cursorDate);
      if (lastCheckedWeek === lastWeek) cursorDate = this.offsetDate(cursorDate, -7);
      cursorWeek = this.getWeekKey(cursorDate);

      while (weeks.includes(cursorWeek)) {
        current++;
        cursorDate = this.offsetDate(cursorDate, -7);
        cursorWeek = this.getWeekKey(cursorDate);
      }
    }

    let max = 0;
    let temp = 1;
    for (let i = 1; i < weeks.length; i++) {
      const diff = this.weeksDiff(weeks[i - 1], weeks[i]);
      if (diff === 1) {
        temp++;
      } else {
        max = Math.max(max, temp);
        temp = 1;
      }
    }
    max = Math.max(max, temp);

    return { current, max };
  }

  private offsetDate(date: string, days: number): string {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  private daysDiff(a: string, b: string): number {
    const diff = new Date(b).getTime() - new Date(a).getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  private getWeekKey(date: string): string {
    const d = new Date(date);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    return monday.toISOString().split('T')[0];
  }

  private weeksDiff(a: string, b: string): number {
    return Math.round(this.daysDiff(a, b) / 7);
  }
}