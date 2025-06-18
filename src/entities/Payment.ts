import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Booking } from "./Booking";


@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal')
  amount!: number;

  @Column()
  status!: string; // 'pending', 'completed', 'failed'

  @Column()
  method!: string; // 'credit_card', 'paypal'

  @Column()
  transaction_id!: string;

  @ManyToOne(() => Booking, booking => booking.payments)
  booking!: Booking;
}