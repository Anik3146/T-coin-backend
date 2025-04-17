import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  activity?: string;

  @Column()
  activity_time?: Date;

  @ManyToOne(() => User, (user) => user.activity_logs)
  user?: User;

  @Column()
  newAppuserId?: string;

  @Column()
  email?: string;

  @Column()
  phone_no?: string;

  @Column()
  device_id?: string;

  @Column()
  IMEI?: string;

  @Column()
  latitude?: number;

  @Column()
  longitude?: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
