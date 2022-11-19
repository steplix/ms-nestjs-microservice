"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configModule = void 0;
const config_1 = require("@nestjs/config");
const services_1 = __importDefault(require("./services"));
//
// constants
//
const baseDir = process.cwd();
const env = process.env.NODE_ENV;
//
// export
//
exports.configModule = config_1.ConfigModule.forRoot({
    envFilePath: [`${baseDir}/.env`, `${baseDir}/.env.${env}`, `${baseDir}/.env.${env}.local`],
    load: [services_1.default],
    isGlobal: true,
});
