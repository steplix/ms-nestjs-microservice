"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionsFilter = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const http_constants_1 = require("http-constants");
const helpers_1 = require("../../helpers");
// constant for generic error
const INTERNAL_SERVER_ERROR = 500;
// default error options
const defaultOptions = {
    error: "InternalServerError",
    message: "Internal Server Error",
    code: INTERNAL_SERVER_ERROR,
};
// constant for httpCodes
const httpValidCodes = Object.values(http_constants_1.codes);
// constant for verify environment
const isProd = ["prod", "production"].includes(String(process.env.NODE_ENV).toLowerCase());
/**
 * Exceptions handler
 */
let ExceptionsFilter = class ExceptionsFilter extends core_1.BaseExceptionFilter {
    /**
     * Handle all error cases
     */
    async catch(error, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const context = {
            options: defaultOptions,
            error,
            res,
        };
        let exception;
        //
        // Handle http error
        //
        if (error instanceof common_1.HttpException) {
            helpers_1.logger.error(error, isProd ? "" : error.stack || "");
            exception = error;
            // Extra information on Http Exception
            if (exception.response && !(0, lodash_1.isString)(exception.response)) {
                exception.response.extra = {
                    ...(exception.response.extra || exception.response),
                };
            }
        }
        //
        // Handle error in error
        //
        else if (this.isErrorInError(error)) {
            exception = this.transformErrorInError(context);
        }
        //
        // Handle axios errors
        //
        else if (this.isAxiosError(error)) {
            exception = this.transformAxiosError(context);
        }
        //
        // Handle other error cases
        //
        else {
            // Get the message
            const message = (error && error.message) || context.options.message;
            // Get the status code
            const status = (error && (error.code || error.statusCode)) || context.options.code || INTERNAL_SERVER_ERROR;
            // Get the extra information
            const extra = (0, lodash_1.merge)({}, (error && error.extra) || {}, context.options.extra || {});
            helpers_1.logger.error(message, status, isProd ? "" : error.stack || "");
            exception = new common_1.HttpException({ message, extra }, status);
        }
        const responseStatusCode = httpValidCodes.includes(exception.getStatus())
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        res.status(responseStatusCode).json({
            path: req.url,
            statusCode: responseStatusCode,
            rawStatusCode: exception.getStatus(),
            message: exception.message,
            errors: exception.response?.message,
            extra: exception.response?.extra,
        });
    }
    /**
     * Indicate is error is an "error in error"
     */
    isErrorInError(error) {
        return (error &&
            error.error &&
            ((0, lodash_1.isString)(error.error.error) || (0, lodash_1.isString)(error.error.message)) &&
            ((0, lodash_1.isNumber)(error.error.code) || (0, lodash_1.isNumber)(error.error.status) || (0, lodash_1.isNumber)(error.error.statusCode)));
    }
    /**
     * Transform error in error on comodinx/error system
     */
    transformErrorInError({ error, options }) {
        const realError = error.error;
        const message = realError.error || realError.message;
        const extra = {
            ...realError.extra,
            ...options.extra,
        };
        return this.transformError(realError, message, extra, /* debugable error */ error.stack ? error : realError);
    }
    /**
     * Indicate is error is an "axios error"
     */
    isAxiosError(error) {
        return error && error.isAxiosError;
    }
    /**
     * Transform axios error on comodinx/error system
     */
    transformAxiosError({ error, options }) {
        const realError = error.response.data;
        const message = realError.error || realError.message || realError;
        const extra = {
            ...realError.extra,
            ...options.extra,
            ...error.extra,
        };
        return this.transformError((0, lodash_1.isString)(realError) ? error.response : realError, message, extra, 
        /* debugable error */ error.stack ? error : realError);
    }
    /**
     * Transform axios error on comodinx/error system
     */
    transformError(error, message, extra, debugableError) {
        // Handle error by code
        if (error.code && httpValidCodes.includes(Number(error.code))) {
            // Log error if flag log is true
            helpers_1.logger.error(debugableError, error.code, isProd ? "" : error.stack || "");
            return new common_1.HttpException({ message, extra }, error.code);
        }
        // Handle error by status
        if (error.status && httpValidCodes.includes(Number(error.status))) {
            // Log error if flag log is true
            helpers_1.logger.error(debugableError, error.status, isProd ? "" : error.stack || "");
            return new common_1.HttpException({ message, extra }, error.status);
        }
        // Handle error by statusCode
        if (error.statusCode && httpValidCodes.includes(Number(error.statusCode))) {
            // Log error if flag log is true
            helpers_1.logger.error(debugableError, error.statusCode, isProd ? "" : error.stack || "");
            return new common_1.HttpException({ message, extra }, error.statusCode);
        }
        // Log error if flag log is true
        helpers_1.logger.error(debugableError, error.code || error.status || error.statusCode || INTERNAL_SERVER_ERROR, isProd ? "" : error.stack || "");
        return new common_1.HttpException({ message, extra }, error.code || error.status || error.statusCode || INTERNAL_SERVER_ERROR);
    }
};
ExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], ExceptionsFilter);
exports.ExceptionsFilter = ExceptionsFilter;
