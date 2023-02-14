import { tap } from 'rxjs/operators';
import { type Observable, of } from 'rxjs';
import { isEmpty, isFunction, isNil } from 'lodash';
import { type CallHandler, type ExecutionContext, type HttpServer, Inject, Injectable, type NestInterceptor } from '@nestjs/common';
import { type ICacheOptions } from '../decorators/cache';
import { isCacheEnabled, cache } from '../cache';
import { logger } from '../helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(`${process.cwd()}/package.json`);
//
// constants
//
const cacheKeyPrefix = process.env.CACHE_KEY_PREFIX ?? pkg.name;
const HTTP_ADAPTER_HOST = 'HttpAdapterHost';
const REFLECTOR = 'Reflector';

//
// interfaces
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHttpAdapterHost<T extends HttpServer = any> {
    httpAdapter: T
}

//
// main class
//
@Injectable()
export class CacheInterceptor implements NestInterceptor {
    //
    // variables
    //
    @Inject(HTTP_ADAPTER_HOST)
    protected readonly httpAdapterHost?: IHttpAdapterHost;

    protected allowedMethods = ['GET'];

    //
    // constructors
    //
    constructor (@Inject(REFLECTOR) protected readonly reflector: unknown) {}

    //
    // public
    //
    async intercept<T> (context: ExecutionContext, next: CallHandler): Promise<Observable<T>> {
        if (!isCacheEnabled) {
            return next.handle();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = (this.reflector as any).get('cache', context.getHandler()) ?? {};
        const exclude = isFunction(options.exclude) ? await options.exclude(context) : options.exclude;

        if (exclude === true) {
            return next.handle();
        }

        const key = await this.trackBy(context, options);

        if (key === undefined) {
            return next.handle();
        }

        try {
            const value = await cache.get(key);
            if (!isNil(value)) {
                return of(value);
            }

            const time = isFunction(options.time) ? await options.time(context) : options.time;
            return next
                .handle()
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                .pipe(tap(async response => {
                    try {
                        const args = isNil(time) ? [key, response] : [key, response, time];
                        await cache.put(...args);
                    } catch {
                        logger.error(`An error has occurred when inserting "key: ${key}", "value: ${response}"`, 'CacheInterceptor');
                    }
                }));
        } catch {
            return next.handle();
        }
    }

    //
    // private
    //
    protected async trackBy (context: ExecutionContext, options: ICacheOptions): Promise<string | undefined> {
        const httpAdapter = this.httpAdapterHost?.httpAdapter;
        const isHttpApp = httpAdapter !== undefined && !isEmpty(httpAdapter.getRequestMethod);
        const key = isFunction(options.key) ? await options.key(context) : options.key;

        if (!isHttpApp || !isEmpty(key)) {
            return `${cacheKeyPrefix}.${key}`;
        }

        const request = context.getArgByIndex(0);
        if (!this.isRequestCacheable(context)) {
            return undefined;
        }
        return `${cacheKeyPrefix}.${httpAdapter.getRequestUrl(request)}`;
    }

    protected isRequestCacheable (context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        return this.allowedMethods.includes(req.method);
    }
}
