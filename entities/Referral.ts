import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Referral {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  referred_by?: User;

  @Column()
  referral_code?: string;

  @Column({ default: false })
  is_used?: boolean;

  @Column({ nullable: true })
  used_by_user_id?: number;

  @CreateDateColumn()
  createdAt?: Date;
}
