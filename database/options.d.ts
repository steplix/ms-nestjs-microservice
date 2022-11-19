import { SequelizeOptionsFactory, SequelizeModuleOptions } from "@nestjs/sequelize";
/**
 * Indicate if Database feature is enabled
 */
export declare const isDatabaseEnabled: boolean;
/**
 * Database default options
 */
export declare class DatabaseOptionsService implements SequelizeOptionsFactory {
    private readonly config;
    createSequelizeOptions(): SequelizeModuleOptions;
}
