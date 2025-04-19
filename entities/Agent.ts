import { Entity, Column } from "typeorm";
import { User } from "./User";

@Entity()
export class Agent extends User {
  @Column({ nullable: true })
  details?: string;
}
