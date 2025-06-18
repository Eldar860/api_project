import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Car } from "./Car";
import { Payment } from "./Payment";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  start_date!: Date;

  @Column()
  end_date!: Date;

  @Column()
  status!: string;

  @Column('decimal')
  total_price!: number;

  @ManyToOne(() => User, user => user.bookings)
  user!: User;

  @ManyToOne(() => Car, car => car.bookings)
  car!: Car;

  @OneToMany(() => Payment, payment => payment.booking)
  payments!: Payment[];
}