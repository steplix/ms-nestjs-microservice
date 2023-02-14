import { merge, isString, isNumber } from 'lodash';
import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { type Request, type Response } from 'express';
import { codes } from 'http-constants';
import { logger } from '../../helpers';

// constant for generic error
const INTERNAL_SERVER_ERROR = 500;

// default error options
const defaultOptions = {
    error: 'InternalServerError',
    message: 'Internal Server Error',
    code: INTERNAL_SERVER_ERROR,
};

// constant for httpCodes
const httpValidCodes = Object.values(codes);

// constant for verify environment
const isProd = ['prod', 'production'].includes(String(process.env.NODE_ENV).toLowerCase());

/**
 * Exceptions handler
 */
@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
    /**
   * Handle all error cases
   */
    public async catch (error: Error | HttpException, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const context: any = {
            options: defaultOptions,
            error,
            res
        };
        let exception;

        //
        // Handle http error
        //
        if (error instanceof HttpException) {
            logger.error(error, isProd ? '' : error.stack ?? '');
            exception = error;

            // Extra information on Http Exception
            if (!isString(exception.response)) {
                exception.response.extra = {
                    ...(exception.response.extra ?? exception.response)
                };
            }
        } else if (this.isErrorInError(error)) { // Handle error in error
            exception = this.transformErrorInError(context);
        } else if (this.isAxiosError(error)) { // Handle axios errors
            exception = this.transformAxiosError(context);
        } else { // Handle other error cases
            // Get the message
            const message = error?.message ?? context.options.message;
            // Get the status code
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const status = ((error as any)?.code ?? (error as any)?.statusCode) ?? context.options.code ?? INTERNAL_SERVER_ERROR;
            // Get the extra information
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const extra = merge({}, (error as any)?.extra ?? {}, context.options.extra ?? {});

            logger.error(message, status, isProd ? '' : error?.stack ?? '');
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
    private isErrorInError (error): boolean {
        return (
            error?.error !== undefined &&
            (isString(error.error.error) || isString(error.error.message)) &&
            (isNumber(error.error.code) || isNumber(error.error.status) || isNumber(error.error.statusCode))
        );
    }

    /**
   * Transform error in error on comodinx/error system
   */
    private transformErrorInError ({ error, options }): HttpException {
        const realError = error.error;
        const message = realError.error ?? realError.message;
        const extra = {
            ...realError.extra,
            ...options.extra,
        };

        return this.transformError(realError, message, extra, /* debugable error */ error.stack !== undefined ? error : realError);
    }

    /**
   * Indicate is error is an "axios error"
   */
    private isAxiosError (error): boolean {
        return error.isAxiosError;
    }

    /**
   * Transform axios error on comodinx/error system
   */
    private transformAxiosError ({ error, options }): HttpException {
        const realError = error.response.data;
        const message = realError.error ?? realError.message ?? realError;
        const extra = {
            ...realError.extra,
            ...options.extra,
            ...error.extra,
        };

        return this.transformError(
            isString(realError) ? error.response : realError,
            message,
            extra,
            /* debugable error */ error.stack !== undefined ? error : realError
        );
    }

    /**
   * Transform axios error on comodinx/error system
   */
    private transformError (error, message, extra, debugableError): HttpException {
        // Handle error by code
        if (error.code !== undefined && httpValidCodes.includes(Number(error.code))) {
            // Log error if flag log is true
            logger.error(debugableError, error.code, isProd ? '' : error.stack ?? '');
            return new HttpException({ message, extra }, error.code);
        }

        // Handle error by status
        if (error.status !== undefined && httpValidCodes.includes(Number(error.status))) {
            // Log error if flag log is true
            logger.error(debugableError, error.status, isProd ? '' : error.stack ?? '');
            return new HttpException({ message, extra }, error.status);
        }

        // Handle error by statusCode
        if (error.statusCode !== undefined && httpValidCodes.includes(Number(error.statusCode))) {
            // Log error if flag log is true
            logger.error(debugableError, error.statusCode, isProd ? '' : error.stack ?? '');
            return new HttpException({ message, extra }, error.statusCode);
        }

        // Log error if flag log is true
        logger.error(
            debugableError,
            error.code ?? error.status ?? error.statusCode ?? INTERNAL_SERVER_ERROR,
            isProd ? '' : error.stack ?? ''
        );
        return new HttpException(
            { message, extra },
            error.code ?? error.status ?? error.statusCode ?? INTERNAL_SERVER_ERROR
        );
    }
}
