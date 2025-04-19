import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Savings {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user?: User;

  @Column("decimal", { precision: 10, scale: 2 })
  amount?: number;

  @Column()
  savings_date?: Date;

  @Column({ default: true })
  is_active?: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
