import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { InvestmentProject } from "./InvestmentProject";

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  investor?: User;

  @ManyToOne(() => InvestmentProject)
  project?: InvestmentProject;

  @Column("decimal", { precision: 10, scale: 2 })
  amount?: number;

  @Column()
  invested_on?: Date;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  returned_amount?: number;
}
