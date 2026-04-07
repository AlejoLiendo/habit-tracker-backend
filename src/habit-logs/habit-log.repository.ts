import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IHabitLogRepository } from './interfaces/habit-log.repository.interface';
import { HabitLog } from './habit-log.entity';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';

@Injectable()
export class HabitLogRepository implements IHabitLogRepository {
  constructor(
    @InjectRepository(HabitLog) private readonly repo: Repository<HabitLog>,
  ) {}

  async findByHabitId(habitId: number): Promise<HabitLog[]> {
    return this.repo.find({
      where: { habitId },
      order: { date: 'ASC' },
    });
  }

  async findByHabitIdAndDate(habitId: number, date: string): Promise<HabitLog | null> {
    return this.repo.findOneBy({ habitId, date });
  }

  async create(habitId: number, dto: CreateHabitLogDto): Promise<HabitLog> {
    const log = this.repo.create({ habitId, ...dto });
    return this.repo.save(log);
  }

  async delete(habitId: number, date: string): Promise<void> {
    await this.repo.delete({ habitId, date });
  }
}