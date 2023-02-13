import { Test } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { ServiceHealthIndicator } from '../../../services';
import { HealthEntity } from '../../../server/modules/health/entities';
import {
  HealthController,
  HealthService
} from '../../../server/modules/health';
import { LoggerMock } from '../../mocks';

describe('Health', () => {
    //
    // variables
    //
    let controller: HealthController;
    let service: HealthService;

    //
    // hooks
    //
    beforeEach(async () => {
        // Create Nest application and compile module
        const app = await Test.createTestingModule({
            imports: [TerminusModule],
            controllers: [HealthController],
            providers: [HealthService, ServiceHealthIndicator],
        }).compile();

        // Apply mocks
        app.useLogger(new LoggerMock());

        // Get Controller from module
        controller = app.get<HealthController>(HealthController);

        // Get Service from module
        service = app.get<HealthService>(HealthService);
    });

    //
    // tests
    //
    describe('definition', () => {

        it('Controller - should be defined', () => {
            expect(controller).toBeDefined();
        });

        // -------------------------------------------------------------------------

        it('Service - should be defined', () => {
            expect(service).toBeDefined();
        });

    });

    // -----------------------------------------------------------------------------

    describe('healthCheck', () => {

        it('should return an object with health check success status', async () => {
            const result: HealthEntity = {
                alive: true,
                name: '@steplix/microservice',
                version: '1.0.0',
                environment: 'test'
            };

            expect(await controller.healthCheck('')).toEqual(result);
        });

        // -------------------------------------------------------------------------

        it('should return an object with health check failure status', async () => {
            const result: HealthEntity = {
                alive: false,
                name: '@steplix/microservice',
                version: '1.0.0',
                environment: 'test',
                info: {},
                details: {
                    database: {
                        message: 'Connection provider not found in application context',
                        status: 'down'
                    }
                },
                error: {
                    database: {
                        message: 'Connection provider not found in application context',
                        status: 'down'
                    }
                }
            };

            expect(await controller.healthCheck('database')).toEqual(result);
        });

    });
});
