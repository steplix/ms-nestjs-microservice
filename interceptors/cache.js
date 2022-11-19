"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const cache_1 = require("../cache");
const helpers_1 = require("../helpers");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(`${process.cwd()}/package.json`);
//
// constants
//
const cacheKeyPrefix = process.env.CACHE_KEY_PREFIX || pkg.name;
const HTTP_ADAPTER_HOST = "HttpAdapterHost";
const REFLECTOR = "Reflector";
//
// main class
//
let CacheInterceptor = class CacheInterceptor {
    //
    // constructors
    //
    constructor(reflector) {
        this.reflector = reflector;
        this.allowedMethods = ["GET"];
    }
    //
    // public
    //
    async intercept(context, next) {
        if (!cache_1.isCacheEnabled) {
            return next.handle();
        }
        const options = this.reflector.get("cache", context.getHandler()) ?? {};
        const exclude = (0, lodash_1.isFunction)(options.exclude) ? await options.exclude(context) : options.exclude;
        if (exclude) {
            return next.handle();
        }
        const key = await this.trackBy(context, options);
        if (!key) {
            return next.handle();
        }
        try {
            const value = await cache_1.cache.get(key);
            if (!(0, lodash_1.isNil)(value)) {
                return (0, rxjs_1.of)(value);
            }
            const time = (0, lodash_1.isFunction)(options.time) ? await options.time(context) : options.time;
            return next.handle().pipe((0, operators_1.tap)(async (response) => {
                const args = (0, lodash_1.isNil)(time) ? [key, response] : [key, response, time];
                try {
                    await cache_1.cache.put(...args);
                }
                catch {
                    helpers_1.logger.error(`An error has occured when inserting "key: ${key}", "value: ${response}"`, "CacheInterceptor");
                }
            }));
        }
        catch {
            return next.handle();
        }
    }
    //
    // private
    //
    async trackBy(context, options) {
        const httpAdapter = this.httpAdapterHost?.httpAdapter;
        const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
        const key = (0, lodash_1.isFunction)(options.key) ? await options.key(context) : options.key;
        if (!isHttpApp || key) {
            return `${cacheKeyPrefix}.${key}`;
        }
        const request = context.getArgByIndex(0);
        if (!this.isRequestCacheable(context)) {
            return undefined;
        }
        return `${cacheKeyPrefix}.${httpAdapter.getRequestUrl(request)}`;
    }
    isRequestCacheable(context) {
        const req = context.switchToHttp().getRequest();
        return this.allowedMethods.includes(req.method);
    }
};
__decorate([
    (0, common_1.Inject)(HTTP_ADAPTER_HOST),
    __metadata("design:type", Object)
], CacheInterceptor.prototype, "httpAdapterHost", void 0);
CacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(REFLECTOR)),
    __metadata("design:paramtypes", [Object])
], CacheInterceptor);
exports.CacheInterceptor = CacheInterceptor;
