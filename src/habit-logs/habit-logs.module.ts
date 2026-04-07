import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitLog } from './habit-log.entity';
import { HabitLogsService } from './habit-logs.service';
import { HabitLogsController } from './habit-logs.controller';
import { HabitsModule } from '../habits/habits.module';
import { HabitLogRepository } from './habit-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([HabitLog]),
    forwardRef(() => HabitsModule),
  ],
  providers: [HabitLogsService, HabitLogRepository],
  controllers: [HabitLogsController],
  exports: [HabitLogsService],
})
export class HabitLogsModule {}