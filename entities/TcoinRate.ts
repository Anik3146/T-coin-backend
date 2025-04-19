import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class TcoinRate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  from_currency!: string; // e.g. "USD", "EUR", "BDT", etc.

  @Column("decimal", { precision: 10, scale: 2 })
  rate!: number; // how many T-Coins for 1 unit of from_currency

  @Column({ nullable: true })
  country?: string; // Optional: to make rates country-specific

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
