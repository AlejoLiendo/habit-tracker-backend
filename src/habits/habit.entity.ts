import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Frequency } from './frequency.enum';
import { HabitStatus } from './habit-status.enum';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text' })
  frequency: Frequency;

  @Column({ type: 'text', default: HabitStatus.ACTIVE })
  status: HabitStatus;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}