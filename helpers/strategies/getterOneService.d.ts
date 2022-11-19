import { FinderServiceStrategy } from "./finderService";
export declare class GetterOneServiceStrategy extends FinderServiceStrategy {
    /**
     * Get one
     *
     * @param model {Model<?>} Model
     * @param options {object} Find options
     * @param options.query {FinderDto} Query options
     *
     * @return result {?} First result of filtering models by query
     */
    getOne<T>(model: any, options?: any): Promise<T>;
}
