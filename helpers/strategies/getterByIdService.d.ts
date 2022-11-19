export declare class GetterByIdServiceStrategy {
    /**
     * Get by ID
     *
     * @param id {number|string} Unique model IDentifier
     * @param model {Model<?>} Model
     * @param options {object} Find options
     * @param options.field {string} ID column|field name. Default is "id"
     * @param options.query {FinderDto} Query options
     *
     * @return result {?} Result of get model by id
     */
    getById<T>(id: number | string, model: any, options?: any): Promise<T>;
    /**
     * Resolver where condition for id field
     */
    protected resolveWhere(id: number | string, field: string, options: any): void;
}
