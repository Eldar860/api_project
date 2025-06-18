import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Booking } from "./Booking";
import { Review } from "./Review";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  license_number?: string | null;

  @OneToMany(() => Booking, booking => booking.user)
  bookings!: Booking[];

  @OneToMany(() => Review, review => review.user)
  reviews!: Review[];
}