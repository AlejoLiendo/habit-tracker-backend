import { CreateHabitDto } from '../dto/create-habit.dto';
import { UpdateHabitDto } from '../dto/update-habit.dto';
import { HabitStatus } from '../habit-status.enum';
import { Habit } from '../habit.entity';
import { HabitResponse } from './habit-response.interface';

export interface IHabitController {
  findAll(user: { id: number }, status: HabitStatus, today: string): Promise<HabitResponse[]>;
  findByName(user: { id: number }, name: string): Promise<Habit[]>;
  create(user: { id: number }, dto: CreateHabitDto): Promise<Habit>;
  update(user: { id: number }, habitId: number, dto: UpdateHabitDto): Promise<Habit>;
  updateStatus(user: { id: number }, habitId: number, status: HabitStatus): Promise<void>;
  remove(user: { id: number }, habitId: number): Promise<void>;
}