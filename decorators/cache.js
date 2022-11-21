"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const logger_1 = require("../helpers/logger");
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
function Cache(...args) {
    const keyOrTimeOrOptions = args[0] != null ? args[0] : {};
    let options = {};
    // Check if arg is number
    if (isTime(keyOrTimeOrOptions)) {
        // In this case, arg is the expiration time number
        options.time = keyOrTimeOrOptions;
    }
    // Check if arg is string
    else if ((0, lodash_1.isString)(keyOrTimeOrOptions)) {
        // In this case, arg is the cache KEY
        options.key = keyOrTimeOrOptions;
    }
    // Check if arg is boolean
    else if ((0, lodash_1.isBoolean)(keyOrTimeOrOptions)) {
        // In this case, arg is the exclude flag boolean
        options.exclude = !keyOrTimeOrOptions;
    }
    // Check if arg is object
    else if ((0, lodash_1.isObject)(keyOrTimeOrOptions)) {
        // In this case, arg is the cache options
        options = keyOrTimeOrOptions;
    }
    if ((0, lodash_1.isString)(options.time)) {
        const time = parseTime(options.time);
        options.time = time || undefined;
        if (!time) {
            logger_1.logger.warn(`Cant parse string time value [${options.time}] for cache`);
            delete options.time;
        }
    }
    return (0, common_1.SetMetadata)("cache", options);
}
exports.Cache = Cache;
//
// helpers
//
const isTime = (time) => {
    return (0, lodash_1.isNumber)(time) || regexpTime.test(time);
};
const parseTime = (time) => {
    if ((0, lodash_1.isNumber)(time)) {
        return time;
    }
    if ((0, lodash_1.isString)(time)) {
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
