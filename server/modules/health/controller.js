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
exports.HealthController = void 0;
const lodash_1 = require("lodash");
const swagger_1 = require("@nestjs/swagger");
const terminus_1 = require("@nestjs/terminus");
const common_1 = require("@nestjs/common");
const services_1 = require("../../../services");
const database_1 = require("../../../database");
const constants_1 = require("../../../constants");
const service_1 = require("./service");
const entities_1 = require("./entities");
//
// constants
//
const serverHealthPath = process.env.SERVER_HEALTH_PATH || "/health";
const serviceDependencies = process.env.SERVICE_DEPENDENCIES || "";
const healthCheckFailureOnError = constants_1.trues.includes(String(process.env.HEALTH_FAILURE_ON_ERROR).toLowerCase());
//
// class
//
// Swagger documentation
let HealthController = class HealthController {
    constructor(healthService, services, database, health) {
        this.healthService = healthService;
        this.services = services;
        this.database = database;
        this.health = health;
    }
    //
    // public
    //
    // Method and Path
    async healthCheck(include) {
        let res;
        // Default include value
        include = include || "";
        try {
            res = await this.healthService.check();
            const indicators = [];
            if (database_1.isDatabaseEnabled && include.includes("database")) {
                // Health check database connection
                indicators.push(() => this.database.pingCheck("database", { timeout: /* ms */ 2000 }));
            }
            if (include.includes("services")) {
                // Health check microservices dependecies
                serviceDependencies.split(",").forEach((service) => {
                    // Each microservice indicate on SERVICE_DEPENDENCIES, if checked
                    if (service)
                        indicators.push(async () => this.services.isHealthy(service));
                });
            }
            // Check if is necesary check indicators
            if (indicators && indicators.length) {
                const checks = await this.health.check(indicators);
                // Success indicators response
                res.info = checks.info;
                // Prevent unnecesary information
                // Check if details is equal to info
                if (checks.details && !(0, lodash_1.isEqual)(checks.info, checks.details)) {
                    res.details = checks.details;
                }
                // Check if has errors
                if (checks.error && Object.keys(checks.error).length) {
                    res.error = checks.error;
                }
            }
        }
        catch (e) {
            // Check if failure on health check error
            if (healthCheckFailureOnError) {
                throw e;
            }
            // Unmount error response. An response with this if necesary
            const checksError = (e && e.response) || null;
            if (checksError) {
                res.alive = false;
                res.info = checksError.info;
                // Prevent unnecesary information
                // Check if details is equal to info
                if (checksError.details && !(0, lodash_1.isEqual)(checksError.info, checksError.details)) {
                    res.details = checksError.details;
                }
                // Check if has errors
                if (checksError.error && Object.keys(checksError.error).length) {
                    res.error = checksError.error;
                }
            }
            // Common error response
            else {
                res.alive = false;
                res.status = "error";
                res.error = `${e}`;
            }
        }
        return res;
    }
};
__decorate([
    (0, common_1.Get)()
    // Swagger documentation
    ,
    (0, swagger_1.ApiOperation)({ summary: "Return health check status" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Return health check status",
        type: entities_1.HealthEntity,
    }),
    (0, swagger_1.ApiQuery)({ name: "include", example: "database,services", required: false }),
    __param(0, (0, common_1.Query)("include")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "healthCheck", null);
HealthController = __decorate([
    (0, swagger_1.ApiTags)("health"),
    (0, swagger_1.ApiConsumes)("application/json"),
    (0, swagger_1.ApiProduces)("application/json")
    // Controller name
    ,
    (0, common_1.Controller)(serverHealthPath),
    __metadata("design:paramtypes", [service_1.HealthService,
        services_1.ServiceHealthIndicator,
        terminus_1.SequelizeHealthIndicator,
        terminus_1.HealthCheckService])
], HealthController);
exports.HealthController = HealthController;
