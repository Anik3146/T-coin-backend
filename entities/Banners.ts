import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Banners {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title?: string;

  @Column("text")
  description?: string;

  // Store the image URL/path (not binary data)
  @Column()
  image?: string; // Path or URL to the image

  @Column()
  link?: string;

  @Column()
  active?: boolean;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;
}
