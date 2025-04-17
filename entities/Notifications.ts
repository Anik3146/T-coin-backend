import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.notifications)
  user?: User;

  @Column("text")
  message?: string;

  // New 'read' status field: Defaults to false (unread)
  @Column({ default: false })
  read?: boolean;

  @Column()
  date?: Date;
}
