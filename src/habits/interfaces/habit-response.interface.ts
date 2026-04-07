import { Habit } from '../habit.entity';

export interface StreakResult {
  current: number;
  max: number;
}

export interface HabitResponse extends Habit {
  checkedToday: boolean;
  streak: StreakResult;
}