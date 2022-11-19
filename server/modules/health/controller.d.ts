import { HealthCheckService, SequelizeHealthIndicator } from "@nestjs/terminus";
import { ServiceHealthIndicator } from "../../../services";
import { HealthService } from "./service";
import { HealthEntity } from "./entities";
export declare class HealthController {
    private readonly healthService;
    private readonly services;
    private readonly database;
    private readonly health;
    constructor(healthService: HealthService, services: ServiceHealthIndicator, database: SequelizeHealthIndicator, health: HealthCheckService);
    healthCheck(include: string): Promise<HealthEntity>;
}
