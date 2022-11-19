"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredAuthUserInterceptor = void 0;
const common_1 = require("@nestjs/common");
const authUser_1 = require("./authUser");
let RequiredAuthUserInterceptor = class RequiredAuthUserInterceptor extends authUser_1.AuthUserInterceptor {
    async attachUser(req) {
        const accessToken = this.getAccessToken(req);
        if (!accessToken) {
            throw new common_1.HttpException({
                message: "No autorizado",
                extra: {
                    code: "NO_ACCESS_TOKEN",
                },
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const user = await this.getUser(accessToken);
        if (!user) {
            throw new common_1.HttpException({
                message: "No autorizado",
                extra: {
                    code: "NO_USER_FOR_ACCESS_TOKEN",
                },
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        req.user = user;
    }
};
RequiredAuthUserInterceptor = __decorate([
    (0, common_1.Injectable)()
], RequiredAuthUserInterceptor);
exports.RequiredAuthUserInterceptor = RequiredAuthUserInterceptor;
