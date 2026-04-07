import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './habit.entity';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { HabitRepository } from './repositories/habit.repository';
import { HabitLogsModule } from '../habit-logs/habit-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit]),
    forwardRef(() => HabitLogsModule),
  ],
  providers: [HabitsService, HabitRepository],
  controllers: [HabitsController],
  exports: [HabitsService],
})
export class HabitsModule {}