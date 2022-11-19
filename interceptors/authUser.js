"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserInterceptor = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
const helpers_1 = require("../helpers");
let AuthUserInterceptor = class AuthUserInterceptor {
    async intercept(context, next) {
        const [req] = context.getArgs();
        await this.attachUser(req);
        return next.handle();
    }
    async attachUser(req) {
        const accessToken = this.getAccessToken(req);
        if (!accessToken) {
            return;
        }
        const user = await this.getUser(accessToken);
        if (user) {
            req.user = user;
        }
    }
    async getUser(accessToken) {
        try {
            const authService = services_1.Service.get("auth");
            return await authService.get({
                uri: "/api/v1/auth/me",
                headers: {
                    authorization: accessToken,
                },
            });
        }
        catch (e) {
            helpers_1.logger.error(`Can't get user from auth microservice. ${e}`);
            return Promise.resolve();
        }
    }
    getAccessToken(req) {
        return req.headers["authorization"] || null;
    }
};
AuthUserInterceptor = __decorate([
    (0, common_1.Injectable)()
], AuthUserInterceptor);
exports.AuthUserInterceptor = AuthUserInterceptor;
