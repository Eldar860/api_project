import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Car } from './entities/Car';
import { Booking } from './entities/Booking';
import { Payment } from './entities/Payment';
import { Review } from './entities/Review';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME || 'car_rental',
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [User, Car, Booking, Payment, Review],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});