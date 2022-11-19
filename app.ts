// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import helmet from "helmet";
import cookieParser from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, ValidationPipeOptions, INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { resolveEnvVarByApp } from "./helpers";
import { ExceptionsFilter } from "./server/filters";
import { AppModule } from "./app.module";
import { logger } from "./helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(`${process.cwd()}/package.json`);

export class App {
  async bootstrap() {
    const swaggerUrl = resolveEnvVarByApp("DOC_SWAGGER_URL", "/api/doc");

    // 01. Create nest application with factory strategy
    const app = await this.createApp();

    // 02. Setup swagger documentation
    this.setupSwagger(app, pkg, swaggerUrl);

    // 03. Setup middlewares
    this.setupMiddlewares(app);

    // 04. Listen application
    await this.listen(app);

    // 05. Log necesary information
    this.log(app, swaggerUrl);

    return app;
  }

  getAppModule() {
    return AppModule;
  }

  getValidationPipeOptions(): ValidationPipeOptions {
    return {} as ValidationPipeOptions;
  }

  async createApp() {
    return await NestFactory.create(this.getAppModule());
  }

  async setupSwagger(app: INestApplication, pkg: any, swaggerUrl: string) {
    const builder = new DocumentBuilder()
      .setTitle(resolveEnvVarByApp("DOC_SWAGGER_TITLE", pkg.name || "Steplix API"))
      .setDescription(resolveEnvVarByApp("DOC_SWAGGER_DESCRIPTION", pkg.description || ""))
      .setVersion(resolveEnvVarByApp("DOC_SWAGGER_VERSION", pkg.version || "1.0.0"))
      .addBearerAuth()
      .addCookieAuth(resolveEnvVarByApp("DOC_SWAGGER_AUTH_TOKEN", "token"));

    const swaggerServer = resolveEnvVarByApp("DOC_SWAGGER_SERVER");

    if (swaggerServer) {
      builder.addServer(swaggerServer);
    }

    const options = builder.build();

    SwaggerModule.setup(swaggerUrl, app, SwaggerModule.createDocument(app, options));
  }

  setupMiddlewares(app: INestApplication) {
    // Exception handler
    app.useGlobalFilters(new ExceptionsFilter());

    // Helmet
    const directives = helmet.contentSecurityPolicy.getDefaultDirectives();

    delete directives["upgrade-insecure-requests"];
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

    // Serializators
    this.setupInterceptors(app);

    // CORS
    app.enableCors();

    return app;
  }

  setupPipes(app: INestApplication) {
    // Pipes
    app.useGlobalPipes(new ValidationPipe(this.getValidationPipeOptions()));
    return app;
  }

  setupInterceptors(app: INestApplication) {
    return app;
  }

  async listen(app: INestApplication) {
    const port = +(process.env.SERVER_PORT || process.env.PORT || 8000);

    await app.listen(port);
    return app;
  }

  async log(app: INestApplication, swaggerUrl: string) {
    const url = await app.getUrl();

    logger.info(`Application is running on: ${url}`);
    logger.debug(`Documentation is running on: ${url}${swaggerUrl}`);
  }
}
