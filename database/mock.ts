import { map } from "lodash";
import { trues } from "../constants/booleans";
import { logger } from "../helpers/logger";
import { SequelizeModule, SequelizeModuleOptions } from "@nestjs/sequelize";
import { ModelCtor, Sequelize, SequelizeOptions } from "sequelize-typescript";

//
// constants
//
const sequelizeOptions: SequelizeOptions = {
  dialect: "sqlite",
  storage: ":memory:",
  logging: trues.includes(String(process.env.DB_DEBUG).toLowerCase()),
};

//
// interface
//
export declare type MockEntityData = {
  entity: ModelCtor;
  data?: any[];
};

//
// public
//

/**
 * Emulate database module
 */
export const mockDatabaseModule = async (models: ModelCtor[]): Promise<any> => {
  return SequelizeModule.forRoot({
    ...sequelizeOptions,
    models,
    synchronize: true,
  } as SequelizeModuleOptions);
};

/**
 * Emulate database instance object
 *
 * @param initializeBaseData {boolean} Indicate if is necesary insert base data
 *
 * @return Sequelize instance
 */
export const mockDatabase = async (
  initializeBaseData = true,
  listEntitiesData: MockEntityData[] | undefined
): Promise<Sequelize> => {
  const databaseInMemory = new Sequelize(sequelizeOptions);

  // attach models
  if (listEntitiesData) {
    databaseInMemory.addModels(map(listEntitiesData, "entity"));
  }

  // creates the database structure
  await databaseInMemory.sync();

  if (initializeBaseData && listEntitiesData) {
    // insert base data
    await insertMockBaseData(listEntitiesData);
  }

  return databaseInMemory;
};

/**
 * Insert all base data for tests
 */
export const insertMockBaseData = async (listEntitiesData: MockEntityData[]) => {
  for (const key in listEntitiesData) {
    const entityData = listEntitiesData[key];

    await insertMockBaseDataForModel(entityData.entity, entityData.data || []);
  }
};

//
// private
//

const insertMockBaseDataForModel = async (entity: ModelCtor, data: any[]) => {
  for (const item of data) {
    try {
      await entity.create(item as any);
    } catch (e) {
      logger.error(`Error on inser base data for model ${entity.name}`, e);
      throw e;
    }
  }
};
