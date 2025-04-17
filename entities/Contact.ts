import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class ContactUs {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name?: string;

  @Column()
  contact_no?: string;

  @Column("text")
  message?: string;

  @ManyToOne(() => User, (user) => user.contactUs)
  user?: User;
}
