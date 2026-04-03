import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './habit.entity';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { HabitRepository } from './repositories/habit.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Habit])],
  providers: [HabitsService, HabitRepository],
  controllers: [HabitsController],
  exports: [HabitsService],
})
export class HabitsModule {}