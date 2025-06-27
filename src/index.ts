import 'dotenv/config';
import "reflect-metadata";
import { DataSource } from "typeorm";
import express, { Request, Response, NextFunction } from "express";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Car } from "./entities/Car";
import { User } from "./entities/User";
import { Booking } from "./entities/Booking";
import { Payment } from "./entities/Payment";
import { Review } from "./entities/Review";

const app = express();
app.use(express.json());

// Инициализация DataSource
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "car_rental",
  synchronize: true,
  logging: true,
  entities: [User, Car, Booking, Payment, Review],
  migrations: [],
  subscribers: [],
});

// Типы для запросов
interface CreateUserRequest {
  name: string;
  email: string;
  license_number?: string;
}

interface CreateCarRequest {
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
}

interface CreateBookingRequest {
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
}

interface CreatePaymentRequest {
  booking_id: number;
  amount: number;
  method: string;
}

interface CreateReviewRequest {
  user_id: number;
  car_id: number;
  rating: number;
  comment?: string;
}

// Обработчик для async/await
const asyncHandler = <P, ResBody, ReqBody, ReqQuery>(
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<void | Response<ResBody>>
) => {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => {
    handler(req, res, next).catch(next);
  };
};

// Swagger Config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Rental API',
      version: '1.0.0',
      description: 'API для сервиса аренды автомобилей',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Локальный сервер разработки',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Иван Иванов' },
            email: { type: 'string', example: 'ivan@example.com' },
            license_number: { type: 'string', example: 'AB123456' }
          }
        },
        Car: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            brand: { type: 'string', example: 'Toyota' },
            model: { type: 'string', example: 'Camry' },
            year: { type: 'integer', example: 2023 },
            price_per_day: { type: 'number', example: 50.00 }
          }
        }
      }
    }
  },
  apis: ['./src/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Пользователь создан
 */
app.post('/users', asyncHandler<{}, any, CreateUserRequest, any>(async (req, res) => {
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.license_number = req.body.license_number || null;
  
  await AppDataSource.manager.save(user);
  res.status(201).json(user);
}));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/users', asyncHandler(async (req, res) => {
  const users = await AppDataSource.manager.find(User);
  res.json(users);
}));

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Добавить новый автомобиль
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Автомобиль создан
 */
app.post('/cars', asyncHandler<{}, any, CreateCarRequest, any>(async (req, res) => {
  const car = new Car();
  car.brand = req.body.brand;
  car.model = req.body.model;
  car.year = req.body.year;
  car.price_per_day = req.body.price_per_day;
  
  await AppDataSource.manager.save(car);
  res.status(201).json(car);
}));

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Получить список автомобилей
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Список автомобилей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
app.get('/cars', asyncHandler(async (req, res) => {
  const cars = await AppDataSource.manager.find(Car);
  res.json(cars);
}));

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Создать бронирование
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *               car_id:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Бронирование создано
 *       404:
 *         description: Пользователь или автомобиль не найден
 */
app.post('/bookings', asyncHandler<{}, any, CreateBookingRequest, any>(async (req, res) => {
  const user = await AppDataSource.manager.findOne(User, { 
    where: { id: req.body.user_id } 
  });
  const car = await AppDataSource.manager.findOne(Car, { 
    where: { id: req.body.car_id } 
  });
  
  if (!user || !car) {
    return res.status(404).json({ error: "User or Car not found" });
  }

  const booking = new Booking();
  booking.user = user;
  booking.car = car;
  booking.start_date = new Date(req.body.start_date);
  booking.end_date = new Date(req.body.end_date);
  booking.status = 'pending';
  
  const days = (booking.end_date.getTime() - booking.start_date.getTime()) / (1000 * 3600 * 24);
  booking.total_price = days * car.price_per_day;
  
  await AppDataSource.manager.save(booking);
  res.status(201).json(booking);
}));

/**
 * @swagger
 * /users/{id}/bookings:
 *   get:
 *     summary: Получить бронирования пользователя
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Список бронирований
 */
app.get('/users/:id/bookings', asyncHandler<{id: string}, any, any, any>(async (req, res) => {
  const user = await AppDataSource.manager.findOne(User, {
    where: { id: parseInt(req.params.id) },
    relations: ["bookings"]
  });
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json(user.bookings);
}));

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Создать платеж
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: number
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *     responses:
 *       201:
 *         description: Платеж создан
 */
app.post('/payments', asyncHandler<{}, any, CreatePaymentRequest, any>(async (req, res) => {
  const booking = await AppDataSource.manager.findOne(Booking, { 
    where: { id: req.body.booking_id } 
  });
  
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const payment = new Payment();
  payment.booking = booking;
  payment.amount = req.body.amount;
  payment.method = req.body.method;
  payment.status = 'pending';
  payment.transaction_id = `tx_${Date.now()}`;
  
  await AppDataSource.manager.save(payment);
  res.status(201).json(payment);
}));

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Оставить отзыв
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *               car_id:
 *                 type: number
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Отзыв добавлен
 */
app.post('/reviews', asyncHandler<{}, any, CreateReviewRequest, any>(async (req, res) => {
  const user = await AppDataSource.manager.findOne(User, { 
    where: { id: req.body.user_id } 
  });
  const car = await AppDataSource.manager.findOne(Car, { 
    where: { id: req.body.car_id } 
  });
  
  if (!user || !car) {
    return res.status(404).json({ error: "User or Car not found" });
  }

  const review = new Review();
  review.user = user;
  review.car = car;
  review.rating = req.body.rating;
  review.comment = req.body.comment || null;
  review.date = new Date();
  
  await AppDataSource.manager.save(review);
  res.status(201).json(review);
}));

// Обработчик ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');
    
    app.listen(3000, () => {
      console.log(' Server running on http://localhost:3000');
      console.log(' Docs available at http://localhost:3000/docs');
    });
  } catch (error) {
    console.error(' DB connection error:', error);
    process.exit(1);
  }
}

startServer();