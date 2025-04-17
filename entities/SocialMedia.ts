import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SocialMedia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title?: string;

  @Column()
  Link?: string;

  @Column({ nullable: true })
  icon?: string; // You can store a URL to the icon image or any other reference here
}
