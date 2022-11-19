import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
/**
 * Log http access
 *
 * Format => :method :url :status :response-time ms - :res[content-length]
 */
export declare class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
    getResponseTime(startAt: [number, number]): string;
    headersSent(res: Response): boolean;
}
