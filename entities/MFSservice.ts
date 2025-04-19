import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class MFSService {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  service_name?: string;

  @Column()
  country?: string;
}
