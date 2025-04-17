import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class AppInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title?: string;

  @Column()
  subtitle?: string;

  @Column("text")
  description?: string;

  @Column()
  shareLink?: string;

  @Column()
  privacyPolicy?: string;

  @Column()
  latest_app_version?: string;

  @Column()
  latest_ios_version?: string;

  @Column()
  is_update_available?: boolean;

  @Column()
  update_note?: string;

  @Column()
  google_play_update_link?: string;

  @Column()
  app_store_update_link?: string;

  @OneToMany(() => User, (user) => user.app_info)
  users?: User[];

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;
}
