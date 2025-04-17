import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class TransactionHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.transaction_history)
  user?: User;

  @Column()
  transaction_type?: string; // Example: 'Deposit', 'Withdrawal', 'Reward', etc.

  @Column("decimal", { precision: 10, scale: 2 })
  amount?: number;

  @Column()
  transaction_date?: Date;

  @Column()
  transaction_status?: string; // Example: 'Completed', 'Pending', 'Failed'

  @Column()
  description?: string; // A description or reference for the transaction

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt?: Date;
}
