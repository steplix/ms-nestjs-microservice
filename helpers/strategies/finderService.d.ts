export declare class FinderServiceStrategy {
    /**
     * Find
     *
     * @param model {Model<?>} Model
     * @param options {object} Find options
     * @param options.query {FinderDto} Query options
     *
     * @return result {array<?>} Result of filtering models by query
     */
    find<T>(model: any, options?: any): Promise<T[]>;
}
