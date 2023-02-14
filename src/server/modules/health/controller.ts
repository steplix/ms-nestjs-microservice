import { isEqual } from 'lodash';
import { ApiTags, ApiQuery, ApiConsumes, ApiProduces, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { HealthCheckService, SequelizeHealthIndicator, type HealthIndicatorResult } from '@nestjs/terminus';
import { Controller, Query, Get } from '@nestjs/common';
import { ServiceHealthIndicator } from '../../../services';
import { isDatabaseEnabled } from '../../../database';
import { trues } from '../../../constants';
import { HealthService } from './service';
import { HealthEntity } from './entities';

//
// constants
//
const serverHealthPath = process.env.SERVER_HEALTH_PATH ?? '/health';
const serviceDependencies = process.env.SERVICE_DEPENDENCIES ?? '';
const healthCheckFailureOnError = trues.includes(String(process.env.HEALTH_FAILURE_ON_ERROR).toLowerCase());

//
// class
//

// Swagger documentation
@ApiTags('health')
@ApiConsumes('application/json')
@ApiProduces('application/json')
// Controller name
@Controller(serverHealthPath)
export class HealthController {
    constructor (
        private readonly healthService: HealthService,
        private readonly services: ServiceHealthIndicator,
        private readonly database: SequelizeHealthIndicator,
        private readonly health: HealthCheckService
    ) {}

    //
    // public
    //

    // Method and Path
    @Get()
    // Swagger documentation
    @ApiOperation({ summary: 'Return health check status' })
    @ApiResponse({
        status: 200,
        description: 'Return health check status',
        type: HealthEntity,
    })
    @ApiQuery({ name: 'include', example: 'database,services', required: false })
    async healthCheck (@Query('include') include: string): Promise<HealthEntity> {
        let res: HealthEntity = new HealthEntity();

        // Default include value
        include = include ?? '';

        try {
            res = await this.healthService.check();
            const indicators: Array<() => Promise<HealthIndicatorResult>> = [];

            if (isDatabaseEnabled && include.includes('database')) {
                // Health check database connection
                indicators.push(() => this.database.pingCheck('database', { timeout: /* ms */ 2000 }));
            }

            if (include.includes('services')) {
                // Health check microservices dependecies
                serviceDependencies.split(',').forEach((service) => {
                    // Each microservice indicate on SERVICE_DEPENDENCIES, if checked
                    if (service !== '') indicators.push(async () => this.services.isHealthy(service));
                });
            }

            // Check if is necesary check indicators
            if (indicators.length > 0) {
                const checks = await this.health.check(indicators);

                // Success indicators response
                res.info = checks.info;

                // Check if details is equal to info
                if (!isEqual(checks.info, checks.details)) {
                    res.details = checks.details;
                }
                // Check if has errors
                if ((checks.error != null) && (Object.keys(checks.error).length > 0)) {
                    res.error = checks.error;
                }
            }
        } catch (e) {
            // Check if failure on health check error
            if (healthCheckFailureOnError) {
                throw e;
            }

            // Unmount error response. An response with this if necesary
            const checksError = e?.response;

            if (checksError !== undefined) {
                res.alive = false;
                res.info = checksError.info;

                // Prevent unnecesary information

                // Check if details is equal to info
                if (!isEqual(checksError.info, checksError.details)) {
                    res.details = checksError.details;
                }
                // Check if has errors
                if (checksError.error != null && (Object.keys(checksError.error).length > 0)) {
                    res.error = checksError.error;
                }
            } else { // Common error response
                res.alive = false;
                res.status = 'error';
                res.error = `${e}`;
            }
        }

        return res;
    }
}
