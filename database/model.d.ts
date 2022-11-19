import "reflect-metadata";
import { Model as BaseModel } from "sequelize-typescript";
import { IRemoteOptions } from "../decorators";
/**
 * Abstract model
 */
export declare abstract class Model<T> extends BaseModel<T> {
    /**
     * Sequelize hook for before find function
     */
    static afterFindHook(models: any, options: any): Promise<void>;
    /**
     * Resolve include relationships
     */
    static resolveIncludes(model: any, findOptions: any): Promise<void>;
    /**
     * Resolve remote relationships
     */
    static resolveRemotes(model: any, findOptions: any): Promise<void>;
    /**
     * Resolve remote relationship
     */
    static resolveRemote(model: any, findOptions: any, remoteField: string, remoteOptions: IRemoteOptions): Promise<void>;
    /**
     * Resolve remote options for relationship
     */
    static resolveRemoteRequestOptions(remoteOptions: any, defaultOptions: any): Promise<any>;
    /**
     * Resolve remote options for include relationships
     */
    static resolveRemoteRequestOptionsForIncludes(remoteOptions: any, parentField?: string): Promise<any[]>;
    /**
     * Resolve remote options for remotes relationships
     */
    static resolveRemoteRequestOptionsForRemotes(remoteOptions: any, parentField?: string): Promise<any[]>;
}
