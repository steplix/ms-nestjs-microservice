"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const helpers_1 = require("../../helpers");
const constants_1 = require("../../constants");
//
// constants
//
const serverHealthPath = process.env.SERVER_HEALTH_PATH || "/health";
const healthCheckLogHttpAccess = constants_1.trues.includes(String(process.env.HEALTH_LOG_HTTP_ACCESS).toLowerCase());
//
// main class
//
/**
 * Log http access
 *
 * Format => :method :url :status :response-time ms - :res[content-length]
 */
let LoggerMiddleware = class LoggerMiddleware {
    use(req, res, next) {
        // Request properties
        const { method, originalUrl, url } = req;
        // Mark start time
        const startAt = process.hrtime();
        // Attach event to close response
        res.on("close", () => {
            const responseTime = this.getResponseTime(startAt);
            const time = responseTime ? ` ${responseTime} ms` : "";
            const status = res.statusCode ? ` ${res.statusCode}` : "";
            const contentLength = this.headersSent(res) ? ` - ${res.getHeader("content-length")}` : "";
            // Check if is necesary manual exclude health check log http access
            if (!healthCheckLogHttpAccess && req.path === serverHealthPath) {
                return;
            }
            // Log http access
            helpers_1.logger.info(`${method} ${originalUrl || url}${status}${time}${contentLength || ""}`);
        });
        next();
    }
    getResponseTime(startAt) {
        // time elapsed from request start
        const elapsed = process.hrtime(startAt);
        // cover to milliseconds
        const ms = elapsed[0] * 1e3 + elapsed[1] * 1e-6;
        // return truncated value
        return ms.toFixed(3);
    }
    headersSent(res) {
        // istanbul ignore next: node.js 0.8 support
        return typeof res.headersSent !== "boolean" ? Boolean(res._header) : res.headersSent;
    }
};
LoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggerMiddleware);
exports.LoggerMiddleware = LoggerMiddleware;
