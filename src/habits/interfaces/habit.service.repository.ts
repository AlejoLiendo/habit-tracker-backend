import { CreateHabitDto } from '../dto/create-habit.dto';
import { UpdateHabitDto } from '../dto/update-habit.dto';
import { HabitStatus } from '../habit-status.enum';
import { Habit } from '../habit.entity';
import { HabitResponse } from './habit-response.interface';

export interface IHabitService {
  findAll(userId: number, status: HabitStatus, today: string): Promise<HabitResponse[]>;
  findByName(userId: number, name: string): Promise<Habit[]>;
  create(userId: number, dto: CreateHabitDto): Promise<Habit>;
  update(userId: number, habitId: number, dto: UpdateHabitDto): Promise<Habit>;
  updateStatus(userId: number, habitId: number, status: HabitStatus): Promise<void>;
  remove(userId: number, habitId: number): Promise<void>;
}