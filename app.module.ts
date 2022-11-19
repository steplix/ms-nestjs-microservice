import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./server/middlewares";
import { moduleOptions } from "./app.module.options";

@Module(moduleOptions)
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(process.env.LOGGER_ROUTES || "*");
  }
}
