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
export class InvestmentProject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title?: string;

  @Column()
  description?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  total_needed?: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total_invested?: number;

  @Column()
  is_open?: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
