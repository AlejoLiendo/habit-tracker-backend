import { HabitLog } from '../habit-log.entity';
import { CreateHabitLogDto } from '../dto/create-habit-log.dto';

export interface IHabitLogController {
  check(user: { id: number }, habitId: number, dto: CreateHabitLogDto): Promise<HabitLog>;
  uncheck(user: { id: number }, habitId: number, date: string): Promise<void>;
}