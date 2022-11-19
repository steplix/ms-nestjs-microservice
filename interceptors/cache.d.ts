import { Observable } from "rxjs";
import { CallHandler, ExecutionContext, HttpServer, NestInterceptor } from "@nestjs/common";
import { ICacheOptions } from "../decorators/cache";
export interface IHttpAdapterHost<T extends HttpServer = any> {
    httpAdapter: T;
}
export declare class CacheInterceptor implements NestInterceptor {
    protected readonly reflector: any;
    protected readonly httpAdapterHost?: IHttpAdapterHost;
    protected allowedMethods: string[];
    constructor(reflector: any);
    intercept<T>(context: ExecutionContext, next: CallHandler): Promise<Observable<T>>;
    protected trackBy(context: ExecutionContext, options: ICacheOptions): Promise<string | undefined>;
    protected isRequestCacheable(context: ExecutionContext): boolean;
}
