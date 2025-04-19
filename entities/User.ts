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
import { Referral } from "./Referral";
import { Investment } from "./Investment";
import { Savings } from "./Savings";

@Unique(["email", "phone_no"])
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  full_name?: string;

  @Column({ nullable: true })
  pin_number?: string; // Pin number instead of password

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
  tcoin_balance?: number; // T-Coin balance (replaces prize money)

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  tcoin_withdrawal?: number; // T-Coin withdrawal amount (replaces withdrawal)

  @Column({ nullable: true })
  deviceToken?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  user_code?: string; // Unique user code

  @Column({ nullable: true })
  qr_code?: string; // URL or data of the QR code

  @Column({ nullable: true })
  passport_file_url?: string; // Passport file URL

  @Column({ nullable: true })
  nid_card_number?: string; // NID card number

  @Column({ nullable: true })
  nid_card_front_pic_url?: string; // NID card front pic URL

  @Column({ nullable: true })
  nid_card_back_pic_url?: string; // NID card back pic URL

  @OneToMany(() => Referral, (referral) => referral.used_by_user_id)
  referrals?: Referral[];

  @OneToMany(() => Investment, (investment) => investment.investor)
  investments?: Investment[];

  @OneToMany(() => Savings, (savings) => savings.user)
  savings?: Savings[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
