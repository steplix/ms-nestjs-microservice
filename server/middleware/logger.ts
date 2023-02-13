import { Injectable, type NestMiddleware } from '@nestjs/common';
import { type Request, type Response, type NextFunction } from 'express';
import { logger } from '../../helpers';
import { trues } from '../../constants';

//
// constants
//
const serverHealthPath = process.env.SERVER_HEALTH_PATH ?? '/health';
const healthCheckLogHttpAccess = trues.includes(String(process.env.HEALTH_LOG_HTTP_ACCESS).toLowerCase());

//
// main class
//

/**
 * Log http access
 *
 * Format => :method :url :status :response-time ms - :res[content-length]
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use (req: Request, res: Response, next: NextFunction): void {
    // Request properties
        const { method, originalUrl, url } = req;

        // Mark start time
        const startAt = process.hrtime();

        // Attach event to close response
        res.on('close', () => {
            const responseTime = this.getResponseTime(startAt);
            const time = responseTime === '' ? ` ${responseTime} ms` : '';
            const status = res.statusCode === undefined ? ` ${res.statusCode}` : '';
            const contentLength = this.headersSent(res) ? ` - ${res.getHeader('content-length')}` : '';

            // Check if is necesary manual exclude health check log http access
            if (!healthCheckLogHttpAccess && req.path === serverHealthPath) {
                return;
            }

            // Log http access
            logger.info(`${method} ${originalUrl ?? url}${status}${time}${contentLength ?? ''}`);
        });

        next();
    }

    // time elapsed from request start
    getResponseTime (startAt: [number, number]): string {
        const elapsed = process.hrtime(startAt);
        // cover to milliseconds
        const ms = elapsed[0] * 1e3 + elapsed[1] * 1e-6;

        // return truncated value
        return ms.toFixed(3);
    }

    // istanbul ignore next: node.js 0.8 support
    headersSent (res: Response): boolean {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return typeof res.headersSent !== 'boolean' ? Boolean((res as any)._header) : res.headersSent;
    }
}
