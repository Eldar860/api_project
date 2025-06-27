Требования для запуска

 Основное ПО
| Компонент       | Версия       | 
|-----------------|-------------|
| Node.js         | v22.16.0+   |
| npm             | 10.9.2+     |
| PostgreSQL      | 17.5.1+     |

 База данных
```sql
CREATE DATABASE car_rental;
GRANT ALL PRIVILEGES ON DATABASE car_rental TO postgres;

npm install express@5.1.0 pg@8.16.0 typeorm@0.3.24 reflect-metadata@0.2.2

npm install --save-dev @types/express@5.0.3 @types/node@24.0.3 ts-node@10.9.2 typescript@5.8.3 nodemon@3.1.10

npm install swagger-jsdoc@6.2.8 swagger-ui-express@5.0.1 @types/swagger-jsdoc@6.0.4 @types/swagger-ui-express@4.1.8

Создайте .env файл в корне проекта: 

ini
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ваш_пароль
DB_NAME=car_rental
