import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
/**
 * Exceptions handler
 */
export declare class ExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
    /**
     * Handle all error cases
     */
    catch(error: any, host: ArgumentsHost): Promise<void>;
    /**
     * Indicate is error is an "error in error"
     */
    private isErrorInError;
    /**
     * Transform error in error on comodinx/error system
     */
    private transformErrorInError;
    /**
     * Indicate is error is an "axios error"
     */
    private isAxiosError;
    /**
     * Transform axios error on comodinx/error system
     */
    private transformAxiosError;
    /**
     * Transform axios error on comodinx/error system
     */
    private transformError;
}
