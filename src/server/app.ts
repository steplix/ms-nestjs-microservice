import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { type INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExceptionsFilter } from './filters';
import { logger, resolveEnvVarByApp } from '../helpers';
import { AppModule } from './modules';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(`${process.cwd()}/package.json`);

export class App {
    async bootstrap (): Promise<void> {
        const swaggerUrl = resolveEnvVarByApp('DOC_SWAGGER_URL', '/api/doc');

        // 01. Create nest application with factory strategy
        const app = await this.createApp();

        // 02. Setup swagger documentation
        this.setupSwagger(app, pkg, swaggerUrl);

        // 03. Setup middleware
        this.setupMiddleware(app);

        // 04. Listen application
        await this.listen(app);

        // 05. Log necessary information
        this.log(app, swaggerUrl);
    }

    private async createApp (): Promise<INestApplication> {
        return await NestFactory.create(AppModule);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    private setupSwagger (app: INestApplication, pkg: any, swaggerUrl: string): void {
        const builder = new DocumentBuilder()
            .setTitle(resolveEnvVarByApp('DOC_SWAGGER_TITLE', pkg.name ?? 'Steplix API'))
            .setDescription(resolveEnvVarByApp('DOC_SWAGGER_DESCRIPTION', pkg.description ?? ''))
            .setVersion(resolveEnvVarByApp('DOC_SWAGGER_VERSION', pkg.version ?? '1.0.0'))
            .addBearerAuth()
            .addCookieAuth(resolveEnvVarByApp('DOC_SWAGGER_AUTH_TOKEN', 'token'));

        const swaggerServer = resolveEnvVarByApp('DOC_SWAGGER_SERVER');

        if (swaggerServer !== undefined) {
            builder.addServer(swaggerServer);
        }

        const options = builder.build();

        SwaggerModule.setup(swaggerUrl, app, SwaggerModule.createDocument(app, options));
    }

    private setupMiddleware (app: INestApplication): void {
    // Exception handler
        app.useGlobalFilters(new ExceptionsFilter());

        // Helmet
        const directives = helmet.contentSecurityPolicy.getDefaultDirectives();

        delete directives['upgrade-insecure-requests'];
        app.use(
            helmet({
                contentSecurityPolicy: {
                    directives,
                },
            })
        );

        // Cookies parser
        app.use(cookieParser());

        // Pipes
        this.setupPipes(app);

        // Serializations
        this.setupInterceptors(app);

        // CORS
        app.enableCors();
    }

    private setupPipes (app: INestApplication): void {
        // Set up pipes: app.useGlobalPipes(new ValidationPipe());
    }

    private setupInterceptors (app: INestApplication): void {
        // Set up interceptors: app.useGlobalInterceptors(new MyInterceptor());
    }

    private async listen (app: INestApplication): Promise<void> {
        const port = +(process.env.SERVER_PORT ?? process.env.PORT ?? 8000);

        await app.listen(port);
    }

    private async log (app: INestApplication, swaggerUrl: string): Promise<void> {
        const url = await app.getUrl();

        logger.info(`Application is running on: ${url}`);
        logger.debug(`Documentation is running on: ${url}${swaggerUrl}`);
    }
}
