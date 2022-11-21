import { ExecutionContext } from "@nestjs/common";
type CacheKeyOptionFactory = (ctx: ExecutionContext) => Promise<string | undefined> | string | undefined;
type CacheTimeOptionFactory = (ctx: ExecutionContext) => Promise<number | undefined> | number | undefined;
type CacheExcludeOptionFactory = (ctx: ExecutionContext) => Promise<boolean | undefined> | boolean | undefined;
export interface ICacheOptions {
    /**
     * Cache key
     */
    key?: string | CacheKeyOptionFactory;
    /**
     * Cache time in milliseconds
     */
    time?: number | string | CacheTimeOptionFactory;
    /**
     * Indicate if the endpoint is exclude from cache
     */
    exclude?: boolean | CacheExcludeOptionFactory;
}
export declare function Cache(): Function;
export declare function Cache(key: string): Function;
export declare function Cache(time: number): Function;
export declare function Cache(exclude: boolean): Function;
export declare function Cache(options: ICacheOptions): Function;
export {};
