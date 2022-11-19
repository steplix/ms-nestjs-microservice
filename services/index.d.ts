import { ConfigService } from "@nestjs/config";
import { Service } from "./service";
export declare const servicesFactory: {
    provide: string;
    inject: (typeof ConfigService)[];
    useFactory: (config: ConfigService) => typeof Service;
};
export * from "./service";
export * from "./health";
