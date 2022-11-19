import { ModelCtor, Sequelize } from "sequelize-typescript";
export declare type MockEntityData = {
    entity: ModelCtor;
    data?: any[];
};
/**
 * Emulate database module
 */
export declare const mockDatabaseModule: (models: ModelCtor[]) => Promise<any>;
/**
 * Emulate database instance object
 *
 * @param initializeBaseData {boolean} Indicate if is necesary insert base data
 *
 * @return Sequelize instance
 */
export declare const mockDatabase: (initializeBaseData: boolean, listEntitiesData: MockEntityData[] | undefined) => Promise<Sequelize>;
/**
 * Insert all base data for tests
 */
export declare const insertMockBaseData: (listEntitiesData: MockEntityData[]) => Promise<void>;
