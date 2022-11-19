import { isString, isNumber, isBoolean, isObject } from "lodash";
import { SetMetadata, ExecutionContext } from "@nestjs/common";

//
// types
//
type CacheOptionFactory = (ctx: ExecutionContext) => Promise<string> | string | number | boolean;

//
// interfaces
//
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

//
// decorator
//
// eslint-disable-next-line @typescript-eslint/ban-types
export function Cache(): Function;

// eslint-disable-next-line @typescript-eslint/ban-types
export function Cache(key: string): Function;

// eslint-disable-next-line @typescript-eslint/ban-types
export function Cache(time: number): Function;

// eslint-disable-next-line @typescript-eslint/ban-types
export function Cache(exclude: boolean): Function;

// eslint-disable-next-line @typescript-eslint/ban-types
export function Cache(options: ICacheOptions): Function;

/**
 * Decorator that sets the caching key used to store/retrieve cached items for
 * Web sockets or Microservice based apps.
 *
 * For example:
 * `@Cache("events")`
 *
 * @param key string naming the field to be used as a cache key
 *
 * @publicApi
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function Cache(...args: any[]): Function {
  const keyOrTimeOrOptions: any = args[0] != null ? args[0] : {};
  let options: ICacheOptions = {};

  // Check if arg is string
  if (isString(keyOrTimeOrOptions)) {
    // In this case, arg is the cache KEY
    options.key = keyOrTimeOrOptions;
  }
  // Check if arg is number
  else if (isNumber(keyOrTimeOrOptions)) {
    // In this case, arg is the expiration time number
    options.time = keyOrTimeOrOptions;
  }
  // Check if arg is boolean
  else if (isBoolean(keyOrTimeOrOptions)) {
    // In this case, arg is the exclude flag boolean
    options.exclude = !keyOrTimeOrOptions;
  }
  // Check if arg is object
  else if (isObject(keyOrTimeOrOptions)) {
    // In this case, arg is the cache options
    options = keyOrTimeOrOptions;
  }

  return SetMetadata("cache", options);
}
