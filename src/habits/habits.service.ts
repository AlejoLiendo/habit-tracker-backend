import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { HabitRepository } from './repositories/habit.repository';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './habit.entity';
import { HabitStatus } from './habit-status.enum';
import { IHabitService } from './interfaces/habit.service.repository';

@Injectable()
export class HabitsService implements IHabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async findAll(userId: number, status: HabitStatus): Promise<Habit[]> {
    return this.habitRepository.findAllByUserId(userId, status);
  }

  async findByName(userId: number, name: string): Promise<Habit[]> {
    return this.habitRepository.findByName(userId, name);
  }

  async create(userId: number, dto: CreateHabitDto): Promise<Habit> {
  const duplicate = await this.habitRepository.findByExactName(userId, dto.name);
  if (duplicate) throw new ConflictException('Ya tenés un hábito con ese nombre');
  return this.habitRepository.create(userId, dto);
}

async update(userId: number, habitId: number, dto: UpdateHabitDto): Promise<Habit> {
  const habit = await this.findOneOrFail(userId, habitId);
  if (dto.name) {
    const duplicate = await this.habitRepository.findByExactName(userId, dto.name);
    if (duplicate && duplicate.id !== habitId) throw new ConflictException('Ya tenés un hábito con ese nombre');
  }
  return this.habitRepository.update(habit, dto);
}

  async updateStatus(userId: number, habitId: number, status: HabitStatus): Promise<void> {
    const habit = await this.findOneOrFail(userId, habitId);
    await this.habitRepository.updateStatus(habit, status);
  }

  async remove(userId: number, habitId: number): Promise<void> {
    const habit = await this.findOneOrFail(userId, habitId);
    await this.habitRepository.softDelete(habit);
  }

  private async findOneOrFail(userId: number, habitId: number): Promise<Habit> {
    const habit = await this.habitRepository.findOneById(habitId);
    if (!habit) throw new NotFoundException('Hábito no encontrado');
    if (habit.userId !== userId) throw new ForbiddenException('No tenés permiso para modificar este hábito');
    return habit;
  }
}