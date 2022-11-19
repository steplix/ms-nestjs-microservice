import { Injectable } from "@nestjs/common";
import { queryParse } from "../query";

//
// source code
//
@Injectable()
export class FinderServiceStrategy {
  /**
   * Find
   *
   * @param model {Model<?>} Model
   * @param options {object} Find options
   * @param options.query {FinderDto} Query options
   *
   * @return result {array<?>} Result of filtering models by query
   */
  async find<T>(model: any, options: any = {}): Promise<T[]> {
    const opts: any = queryParse(options.query);

    return await model.findAll(opts);
  }
}
