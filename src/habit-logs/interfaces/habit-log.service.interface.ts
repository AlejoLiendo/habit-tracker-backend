import { HabitLog } from '../habit-log.entity';
import { CreateHabitLogDto } from '../dto/create-habit-log.dto';

export interface StreakResult {
  current: number;
  max: number;
}

export interface IHabitLogService {
  check(userId: number, habitId: number, dto: CreateHabitLogDto): Promise<HabitLog>;
  uncheck(userId: number, habitId: number, date: string): Promise<void>;
  getStreak(habitId: number, frequency: string): Promise<StreakResult>;
  isCheckedOnDate(habitId: number, date: string): Promise<boolean>;
}