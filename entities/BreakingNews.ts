import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class BreakingNews {
  @PrimaryGeneratedColumn()
  id!: number;

  // Title of the news
  @Column("text")
  title!: string;

  // Description or full content of the news
  @Column("text")
  content!: string;

  // Whether the breaking news is currently active
  @Column({ default: true })
  active_status!: boolean;

  // Optional date field, can be used to store when it was published
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  publishedAt!: Date;
}
