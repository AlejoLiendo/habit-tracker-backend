import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateHabitLogDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  note?: string;
}