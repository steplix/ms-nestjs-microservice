"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
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
    // Check if arg is string
    if ((0, lodash_1.isString)(keyOrTimeOrOptions)) {
        // In this case, arg is the cache KEY
        options.key = keyOrTimeOrOptions;
    }
    // Check if arg is number
    else if ((0, lodash_1.isNumber)(keyOrTimeOrOptions)) {
        // In this case, arg is the expiration time number
        options.time = keyOrTimeOrOptions;
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
    return (0, common_1.SetMetadata)("cache", options);
}
exports.Cache = Cache;
