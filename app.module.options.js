"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleOptions = void 0;
const path_1 = require("path");
const serve_static_1 = require("@nestjs/serve-static");
const config_1 = require("./config");
const modules_1 = require("./server/modules");
const database_1 = require("./database");
const services_1 = require("./services");
const constants_1 = require("./constants");
//
// Default module imports
//
exports.moduleOptions = {
    exports: [],
    controllers: [],
    imports: [
        // Tools
        config_1.configModule,
        // Default Controllers
        modules_1.HealthModule,
    ],
    providers: [
        // Microservices
        services_1.servicesFactory,
    ],
};
//
// Public/Static support
//
if (constants_1.trues.includes(String(process.env.STATICS_ENABLED).toLowerCase())) {
    exports.moduleOptions.imports.push(serve_static_1.ServeStaticModule.forRoot({
        serveRoot: process.env.STATICS_SERVE_ROOT || "/public",
        rootPath: (0, path_1.join)(__dirname, process.env.STATICS_ROOT_PATH || "../public"),
    }));
}
//
// Database
//
if (database_1.isDatabaseEnabled) {
    exports.moduleOptions.imports.push((0, database_1.DatabaseModule)());
}
