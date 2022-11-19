import { merge, isString, isNumber } from "lodash";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { codes } from "http-constants";
import { logger } from "../../helpers";

// constant for generic error
const INTERNAL_SERVER_ERROR = 500;

// default error options
const defaultOptions = {
  error: "InternalServerError",
  message: "Internal Server Error",
  code: INTERNAL_SERVER_ERROR,
};

// constant for httpCodes
const httpValidCodes = Object.values(codes);

// constant for verify environment
const isProd = ["prod", "production"].includes(String(process.env.NODE_ENV).toLowerCase());

/**
 * Exceptions handler
 */
@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
  /**
   * Handle all error cases
   */
  public async catch(error: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const context: any = {
      options: defaultOptions,
      error,
      res,
    };
    let exception;

    //
    // Handle http error
    //
    if (error instanceof HttpException) {
      logger.error(error, isProd ? "" : error.stack || "");
      exception = error;

      // Extra information on Http Exception
      if (exception.response && !isString(exception.response)) {
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
      const extra = merge({}, (error && error.extra) || {}, context.options.extra || {});

      logger.error(message, status, isProd ? "" : error.stack || "");
      exception = new HttpException({ message, extra }, status);
    }

    const responseStatusCode = httpValidCodes.includes(exception.getStatus())
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

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
  private isErrorInError(error) {
    return (
      error &&
      error.error &&
      (isString(error.error.error) || isString(error.error.message)) &&
      (isNumber(error.error.code) || isNumber(error.error.status) || isNumber(error.error.statusCode))
    );
  }

  /**
   * Transform error in error on comodinx/error system
   */
  private transformErrorInError({ error, options }) {
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
  private isAxiosError(error) {
    return error && error.isAxiosError;
  }

  /**
   * Transform axios error on comodinx/error system
   */
  private transformAxiosError({ error, options }) {
    const realError = error.response.data;
    const message = realError.error || realError.message || realError;
    const extra = {
      ...realError.extra,
      ...options.extra,
      ...error.extra,
    };

    return this.transformError(
      isString(realError) ? error.response : realError,
      message,
      extra,
      /* debugable error */ error.stack ? error : realError
    );
  }

  /**
   * Transform axios error on comodinx/error system
   */
  private transformError(error, message, extra, debugableError) {
    // Handle error by code
    if (error.code && httpValidCodes.includes(Number(error.code))) {
      // Log error if flag log is true
      logger.error(debugableError, error.code, isProd ? "" : error.stack || "");
      return new HttpException({ message, extra }, error.code);
    }

    // Handle error by status
    if (error.status && httpValidCodes.includes(Number(error.status))) {
      // Log error if flag log is true
      logger.error(debugableError, error.status, isProd ? "" : error.stack || "");
      return new HttpException({ message, extra }, error.status);
    }

    // Handle error by statusCode
    if (error.statusCode && httpValidCodes.includes(Number(error.statusCode))) {
      // Log error if flag log is true
      logger.error(debugableError, error.statusCode, isProd ? "" : error.stack || "");
      return new HttpException({ message, extra }, error.statusCode);
    }

    // Log error if flag log is true
    logger.error(
      debugableError,
      error.code || error.status || error.statusCode || INTERNAL_SERVER_ERROR,
      isProd ? "" : error.stack || ""
    );
    return new HttpException(
      { message, extra },
      error.code || error.status || error.statusCode || INTERNAL_SERVER_ERROR
    );
  }
}
