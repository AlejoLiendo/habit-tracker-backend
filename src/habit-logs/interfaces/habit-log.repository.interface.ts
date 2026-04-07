import { HabitLog } from '../habit-log.entity';
import { CreateHabitLogDto } from '../dto/create-habit-log.dto';

export interface IHabitLogRepository {
  findByHabitId(habitId: number): Promise<HabitLog[]>;
  findByHabitIdAndDate(habitId: number, date: string): Promise<HabitLog | null>;
  create(habitId: number, dto: CreateHabitLogDto): Promise<HabitLog>;
  delete(habitId: number, date: string): Promise<void>;
}