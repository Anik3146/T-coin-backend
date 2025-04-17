import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class DeviceInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name?: string;

  @Column()
  model?: string;

  @Column()
  manufacturer?: string;

  @Column()
  version?: string;

  @Column()
  brand?: string;

  @Column()
  fingerprint?: string;

  @Column()
  serial_number?: string;

  @Column()
  device_id?: string;

  @Column()
  IMEI?: string;

  @Column()
  latitude?: number;

  @Column()
  longitude?: number;

  @OneToMany(() => User, (user) => user.device_info)
  users?: User[];

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;
}
