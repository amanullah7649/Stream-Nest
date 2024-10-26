// src/config/database.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppConfig } from './app.config';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: AppConfig.POSTGRES_DB_HOST,
    port: AppConfig.POSTGRES_DB_PORT,
    username: AppConfig.POSTGRES_DB_USERNAME,
    password: AppConfig.POSTGRES_DB_PASSWORD,
    database: AppConfig.POSTGRES_DB_NAME,
    entities: [],
    synchronize: AppConfig.NODE_ENV !== 'production', // Only use synchronize in development
};
