import { HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";
export declare class ServiceHealthIndicator extends HealthIndicator {
    isHealthy(key: string): Promise<HealthIndicatorResult>;
}
