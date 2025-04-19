import { Entity, Column } from "typeorm";
import { User } from "./User";

@Entity()
export class Admin extends User {
  @Column({ nullable: true })
  details?: string;
}
