import { type DynamicModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseOptionsService } from './options';

/**
 * Database module
 */
export const DatabaseModule = (): DynamicModule => SequelizeModule.forRootAsync({ useClass: DatabaseOptionsService });
