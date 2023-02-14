import { map } from 'lodash';
import { trues } from '../constants/booleans';
import { logger } from '../helpers/logger';
import { SequelizeModule, type SequelizeModuleOptions } from '@nestjs/sequelize';
import { type ModelCtor, Sequelize } from 'sequelize-typescript';

//
// constants
//

const sequelizeOptions: SequelizeModuleOptions = {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: trues.includes(String(process.env.DB_DEBUG).toLowerCase())
};

//
// interface
//
export declare interface MockEntityData {
    entity: ModelCtor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
}

//
// public
//

/**
 * Emulate database module
 */
export const mockDatabaseModule = async (models: ModelCtor[]): Promise<SequelizeModule> => {
    return SequelizeModule.forRoot({
        ...sequelizeOptions,
        models,
        synchronize: true
    });
};

/**
 * Emulate database instance object
 *
 * @param initializeBaseData {boolean} Indicate if is necessary insert base data
 *
 * @return Sequelize instance
 */
export const mockDatabase = async (initializeBaseData = true, listEntitiesData?: MockEntityData[]): Promise<Sequelize> => {
    const databaseInMemory = new Sequelize(sequelizeOptions);

    // attach models
    if (listEntitiesData != null) {
        databaseInMemory.addModels(map(listEntitiesData, 'entity'));
    }

    // creates the database structure
    await databaseInMemory.sync();

    if (initializeBaseData && (listEntitiesData != null)) {
    // insert base data
        await insertMockBaseData(listEntitiesData);
    }

    return databaseInMemory;
};

/**
 * Insert all base data for tests
 */
export const insertMockBaseData = async (listEntitiesData: MockEntityData[]): Promise<void> => {
    for (const entityData of listEntitiesData) {
        await insertMockBaseDataForModel(entityData.entity, entityData.data);
    }
};

//
// private
//

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const insertMockBaseDataForModel = async (entity: ModelCtor, data: any[]): Promise<void> => {
    for (const item of data) {
        try {
            await entity.create(item);
        } catch (e) {
            logger.error(`Error on insert base data for model ${entity.name}`, e);
            throw e;
        }
    }
};
