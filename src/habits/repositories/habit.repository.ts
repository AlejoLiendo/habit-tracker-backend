import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from '../habit.entity';
import { IHabitRepository } from '../interfaces/habit.repository.interface';
import { CreateHabitDto } from '../dto/create-habit.dto';
import { UpdateHabitDto } from '../dto/update-habit.dto';
import { HabitStatus } from '../habit-status.enum';

@Injectable()
export class HabitRepository implements IHabitRepository {
  constructor(
    @InjectRepository(Habit) private readonly repo: Repository<Habit>,
  ) {}

  async findAllByUserId(userId: number, status: HabitStatus): Promise<Habit[]> {
    return this.repo.find({
      where: { userId, status },
      order: { createdAt: 'ASC' },
    });
  }

  async findOneById(habitId: number): Promise<Habit | null> {
    return this.repo.findOne({
      where: { id: habitId },
    });
  }

  async findByName(userId: number, name: string): Promise<Habit[]> {
    return this.repo.createQueryBuilder('habit')
      .where('habit.userId = :userId', { userId })
      .andWhere('habit.status = :status', { status: HabitStatus.ACTIVE })
      .andWhere('LOWER(habit.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .getMany();
  }

  async findByExactName(userId: number, name: string): Promise<Habit | null> {
  return this.repo.createQueryBuilder('habit')
    .where('habit.userId = :userId', { userId })
    .andWhere('habit.status = :status', { status: HabitStatus.ACTIVE })
    .andWhere('LOWER(habit.name) = LOWER(:name)', { name })
    .getOne();
}

  async create(userId: number, dto: CreateHabitDto): Promise<Habit> {
    const habit = this.repo.create({ ...dto, userId });
    return this.repo.save(habit);
  }

  async update(habit: Habit, dto: UpdateHabitDto): Promise<Habit> {
    Object.assign(habit, dto);
    return this.repo.save(habit);
  }

  async updateStatus(habit: Habit, status: HabitStatus): Promise<Habit> {
    habit.status = status;
    return this.repo.save(habit);
  }

  async softDelete(habit: Habit): Promise<void> {
    await this.repo.softRemove(habit);
  }
}