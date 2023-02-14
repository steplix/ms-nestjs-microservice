import { ConfigService } from '@nestjs/config';
import { Service } from './service';

export const servicesFactory = {
    provide: 'SERVICE',
    inject: [ConfigService],
    useFactory: (config: ConfigService): typeof Service => {
        const services = config.get<[]>('services', []);

        // Add all configurated services to Service class
        Object.values(services).forEach((service) => { Service.add(service); });

        // Return Service class
        return Service;
    },
};

// export Service Class
export * from './service';
// export Service Health Indicator
export * from './health';
