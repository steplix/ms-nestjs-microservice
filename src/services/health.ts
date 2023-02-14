import { HealthIndicator, type HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { Service } from './service';
import { logger } from '../helpers';

@Injectable()
export class ServiceHealthIndicator extends HealthIndicator {
    async isHealthy (key: string): Promise<HealthIndicatorResult> {
        const service = Service.get(key);

        if (service === undefined) {
            throw new HealthCheckError(`Service ${key} not found`, {});
        }

        let isHealthy = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
            alive: true,
            url: service.options.baseURL
        };

        try {
            const status = await service.health();
            data.status = status;
        } catch (e) {
            logger.warn(`Service ${key} failed`, e);
            isHealthy = false;
            data.status = 'error';
            data.error = `Service ${key} failed. ${e}`;
        }

        data.alive = isHealthy;
        return this.getStatus(key, isHealthy, data);
    }
}
