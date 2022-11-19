import { ValidationPipeOptions, INestApplication } from "@nestjs/common";
import { AppModule } from "./app.module";
export declare class App {
    bootstrap(): Promise<INestApplication>;
    getAppModule(): typeof AppModule;
    getValidationPipeOptions(): ValidationPipeOptions;
    createApp(): Promise<INestApplication>;
    setupSwagger(app: INestApplication, pkg: any, swaggerUrl: string): Promise<void>;
    setupMiddlewares(app: INestApplication): INestApplication;
    setupPipes(app: INestApplication): INestApplication;
    setupInterceptors(app: INestApplication): INestApplication;
    listen(app: INestApplication): Promise<INestApplication>;
    log(app: INestApplication, swaggerUrl: string): Promise<void>;
}
