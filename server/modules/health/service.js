"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(`${process.cwd()}/package.json`);
let HealthService = class HealthService {
    async check() {
        const res = {
            alive: true,
            name: pkg.name,
            version: pkg.version || "1.0.0",
            environment: process.env.NODE_ENV,
        };
        return res;
    }
};
HealthService = __decorate([
    (0, common_1.Injectable)()
], HealthService);
exports.HealthService = HealthService;
