import { ExecutionContext } from "@nestjs/common";
type CacheOptionFactory = (ctx: ExecutionContext) => Promise<string> | string | number | boolean;
export interface ICacheOptions {
    /**
     * Cache key
     */
    key?: string | CacheOptionFactory;
    /**
     * Cache time in milliseconds
     */
    time?: number | CacheOptionFactory;
    /**
     * Indicate if the endpoint is exclude from cache
     */
    exclude?: boolean | CacheOptionFactory;
}
export declare function Cache(): Function;
export declare function Cache(key: string): Function;
export declare function Cache(time: number): Function;
export declare function Cache(exclude: boolean): Function;
export declare function Cache(options: ICacheOptions): Function;
export {};
