"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMockBaseData = exports.mockDatabase = exports.mockDatabaseModule = void 0;
const lodash_1 = require("lodash");
const booleans_1 = require("../constants/booleans");
const logger_1 = require("../helpers/logger");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
//
// constants
//
const sequelizeOptions = {
    dialect: "sqlite",
    storage: ":memory:",
    logging: booleans_1.trues.includes(String(process.env.DB_DEBUG).toLowerCase()),
};
//
// public
//
/**
 * Emulate database module
 */
const mockDatabaseModule = async (models) => {
    return sequelize_1.SequelizeModule.forRoot({
        ...sequelizeOptions,
        models,
        synchronize: true,
    });
};
exports.mockDatabaseModule = mockDatabaseModule;
/**
 * Emulate database instance object
 *
 * @param initializeBaseData {boolean} Indicate if is necesary insert base data
 *
 * @return Sequelize instance
 */
const mockDatabase = async (initializeBaseData = true, listEntitiesData) => {
    const databaseInMemory = new sequelize_typescript_1.Sequelize(sequelizeOptions);
    // attach models
    if (listEntitiesData) {
        databaseInMemory.addModels((0, lodash_1.map)(listEntitiesData, "entity"));
    }
    // creates the database structure
    await databaseInMemory.sync();
    if (initializeBaseData && listEntitiesData) {
        // insert base data
        await (0, exports.insertMockBaseData)(listEntitiesData);
    }
    return databaseInMemory;
};
exports.mockDatabase = mockDatabase;
/**
 * Insert all base data for tests
 */
const insertMockBaseData = async (listEntitiesData) => {
    for (const key in listEntitiesData) {
        const entityData = listEntitiesData[key];
        await insertMockBaseDataForModel(entityData.entity, entityData.data || []);
    }
};
exports.insertMockBaseData = insertMockBaseData;
//
// private
//
const insertMockBaseDataForModel = async (entity, data) => {
    for (const item of data) {
        try {
            await entity.create(item);
        }
        catch (e) {
            logger_1.logger.error(`Error on inser base data for model ${entity.name}`, e);
            throw e;
        }
    }
};
