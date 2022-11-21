import { isString, isNumber, isBoolean, isObject } from "lodash";
import { SetMetadata, ExecutionContext } from "@nestjs/common";
import { logger } from "../helpers/logger";

//
// constants
//
const timeUnits = {
  ms: 1,
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 3600000 * 24,
  week: 3600000 * 24 * 7,
  month: 3600000 * 24 * 30,
};

// eslint-disable-next-line
const regexpTime = /^([\d\.,]+)\s+(\w+)$/;
const regexpCaseS = /s$/i;

//
// types
//
type CacheKeyOptionFactory = (ctx: ExecutionContext) => Promise<string | undefined> | string | undefined;
type CacheTimeOptionFactory = (ctx: ExecutionContext) => Promise<number | undefined> | number | undefined;
type CacheExcludeOptionFactory = (ctx: ExecutionContext) => Promise<boolean | undefined> | boolean | undefined;

//
// interfaces
//
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

  // Check if arg is number
  if (isTime(keyOrTimeOrOptions)) {
    // In this case, arg is the expiration time number
    options.time = keyOrTimeOrOptions;
  }
  // Check if arg is string
  else if (isString(keyOrTimeOrOptions)) {
    // In this case, arg is the cache KEY
    options.key = keyOrTimeOrOptions;
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

  if (isString(options.time)) {
    const time = parseTime(options.time);

    options.time = time || undefined;

    if (!time) {
      logger.warn(`Cant parse string time value [${options.time}] for cache`);
      delete options.time;
    }
  }

  return SetMetadata("cache", options);
}

//
// helpers
//

const isTime = (time: number | string): boolean => {
  return isNumber(time) || regexpTime.test(time);
};

const parseTime = (time: number | string): number => {
  if (isNumber(time)) {
    return time;
  }

  if (isString(time)) {
    const split = time.match(regexpTime);

    if (split.length === 3) {
      const len = parseFloat(split[1]);
      let unit = split[2].replace(regexpCaseS, "").toLowerCase();

      if (unit === "m") {
        unit = "ms";
      }
      return (len || 1) * (timeUnits[unit] || 0);
    }
  }
  return;
};
