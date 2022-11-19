import { Injectable } from "@nestjs/common";
import { queryParse } from "../query";

//
// constants
//
const defaultColumn = "id";

//
// source code
//
@Injectable()
export class GetterByIdServiceStrategy {
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
  async getById<T>(id: number | string, model: any, options: any = {}): Promise<T> {
    const opts: any = queryParse(options.query);

    this.resolveWhere(id, options.field || defaultColumn, opts);
    return model.findOne(opts);
  }

  /**
   * Resolver where condition for id field
   */
  protected resolveWhere(id: number | string, field: string, options: any) {
    options.where = options.where || {};
    options.where[field] = id;
  }
}
