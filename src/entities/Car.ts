import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Booking } from "./Booking";
import { Review } from "./Review";

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column("int")
  year!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price_per_day!: number;

  @OneToMany(() => Booking, booking => booking.car)
  bookings!: Booking[];

  @OneToMany(() => Review, review => review.car)
  reviews!: Review[];
}