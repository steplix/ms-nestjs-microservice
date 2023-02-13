import { Module, type NestModule, type MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '../middleware';
import { moduleOptions } from './app.module.options';

@Module(moduleOptions)
export class AppModule implements NestModule {
    configure (consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes(process.env.LOGGER_ROUTES ?? '*');
    }
}
