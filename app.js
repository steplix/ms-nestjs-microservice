"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helpers_1 = require("./helpers");
const filters_1 = require("./server/filters");
const app_module_1 = require("./app.module");
const helpers_2 = require("./helpers");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(`${process.cwd()}/package.json`);
class App {
    async bootstrap() {
        const swaggerUrl = (0, helpers_1.resolveEnvVarByApp)("DOC_SWAGGER_URL", "/api/doc");
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
        return app_module_1.AppModule;
    }
    getValidationPipeOptions() {
        return {};
    }
    async createApp() {
        return await core_1.NestFactory.create(this.getAppModule());
    }
    async setupSwagger(app, pkg, swaggerUrl) {
        const builder = new swagger_1.DocumentBuilder()
            .setTitle((0, helpers_1.resolveEnvVarByApp)("DOC_SWAGGER_TITLE", pkg.name || "Steplix API"))
            .setDescription((0, helpers_1.resolveEnvVarByApp)("DOC_SWAGGER_DESCRIPTION", pkg.description || ""))
            .setVersion((0, helpers_1.resolveEnvVarByApp)("DOC_SWAGGER_VERSION", pkg.version || "1.0.0"))
            .addBearerAuth()
            .addCookieAuth((0, helpers_1.resolveEnvVarByApp)("DOC_SWAGGER_AUTH_TOKEN", "token"));
        const swaggerServer = (0, helpers_1.resolveEnvVarByApp)("DOC_SWAGGER_SERVER");
        if (swaggerServer) {
            builder.addServer(swaggerServer);
        }
        const options = builder.build();
        swagger_1.SwaggerModule.setup(swaggerUrl, app, swagger_1.SwaggerModule.createDocument(app, options));
    }
    setupMiddlewares(app) {
        // Exception handler
        app.useGlobalFilters(new filters_1.ExceptionsFilter());
        // Helmet
        const directives = helmet_1.default.contentSecurityPolicy.getDefaultDirectives();
        delete directives["upgrade-insecure-requests"];
        app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives,
            },
        }));
        // Cookies parser
        app.use((0, cookie_parser_1.default)());
        // Pipes
        this.setupPipes(app);
        // Serializators
        this.setupInterceptors(app);
        // CORS
        app.enableCors();
        return app;
    }
    setupPipes(app) {
        // Pipes
        app.useGlobalPipes(new common_1.ValidationPipe(this.getValidationPipeOptions()));
        return app;
    }
    setupInterceptors(app) {
        return app;
    }
    async listen(app) {
        const port = +(process.env.SERVER_PORT || process.env.PORT || 8000);
        await app.listen(port);
        return app;
    }
    async log(app, swaggerUrl) {
        const url = await app.getUrl();
        helpers_2.logger.info(`Application is running on: ${url}`);
        helpers_2.logger.debug(`Documentation is running on: ${url}${swaggerUrl}`);
    }
}
exports.App = App;
