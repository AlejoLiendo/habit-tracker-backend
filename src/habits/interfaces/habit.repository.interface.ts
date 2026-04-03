import { Habit } from '../habit.entity';
import { CreateHabitDto } from '../dto/create-habit.dto';
import { UpdateHabitDto } from '../dto/update-habit.dto';
import { HabitStatus } from '../habit-status.enum';

export interface IHabitRepository {
  findAllByUserId(userId: number, status: HabitStatus): Promise<Habit[]>;
  findOneById(habitId: number): Promise<Habit | null>;
  findByName(userId: number, name: string): Promise<Habit[]>;
  findByExactName(userId: number, name: string): Promise<Habit | null>;
  create(userId: number, dto: CreateHabitDto): Promise<Habit>;
  update(habit: Habit, dto: UpdateHabitDto): Promise<Habit>;
  updateStatus(habit: Habit, status: HabitStatus): Promise<Habit>;
  softDelete(habit: Habit): Promise<void>;
}