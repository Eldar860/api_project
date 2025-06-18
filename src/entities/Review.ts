import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Car } from "./Car";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string | null;

  @Column()
  date!: Date;

  @Column()
  is_approved!: boolean;

  @ManyToOne(() => User, user => user.reviews)
  user!: User;

  @ManyToOne(() => Car, car => car.reviews)
  car!: Car;
}