"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger_1 = require("@tsed/logger");
const resolvers_1 = require("./resolvers");
const name = (0, resolvers_1.resolveEnvVarByApp)("LOGGER_NAME", (0, resolvers_1.resolveEnvVarByApp)("APP_NAME", "app"));
const level = (0, resolvers_1.resolveEnvVarByApp)("LOGGER_LEVEL", "debug");
exports.logger = new logger_1.Logger(name);
exports.logger.appenders.set("console-log", {
    type: "console",
    level,
});
