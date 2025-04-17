import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  Unique,
} from "typeorm";
import { ActivityLog } from "./ActivityLog";
import { ContactUs } from "./Contact";
import { DeviceInfo } from "./DeviceInfo";
import { AppInfo } from "./AppInfo";
import { TransactionHistory } from "./TransactionHistory";
import { Notification } from "./Notifications";

@Unique(["email", "phone_no"])
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  full_name?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone_no?: string;

  @ManyToOne(() => AppInfo, (appInfo) => appInfo.users)
  app_info?: AppInfo;

  @ManyToOne(() => DeviceInfo, (deviceInfo) => deviceInfo.users)
  device_info?: DeviceInfo;

  @Column({ nullable: true })
  accepted_terms?: boolean;

  @Column({ nullable: true })
  accepted_terms_time?: Date;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip_code?: string;

  @Column({ nullable: true })
  latitude?: number;

  @Column({ nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  institution_name?: string;

  @Column({ nullable: true })
  birth_date?: Date;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => ContactUs, (contactUs) => contactUs.user)
  contactUs?: ContactUs[];

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
  activity_logs!: ActivityLog[]; // One user can have many activity logs

  @OneToMany(
    () => TransactionHistory,
    (transactionHistory) => transactionHistory.user
  )
  transaction_history?: TransactionHistory[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications?: Notification[];

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  total_prize_money_received?: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  total_withdrawal?: number;

  @Column({ nullable: true })
  deviceToken?: string;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
