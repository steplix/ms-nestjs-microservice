import { Injectable } from "@nestjs/common";
import { FinderServiceStrategy } from "./finderService";

//
// source code
//
@Injectable()
export class GetterOneServiceStrategy extends FinderServiceStrategy {
  /**
   * Get one
   *
   * @param model {Model<?>} Model
   * @param options {object} Find options
   * @param options.query {FinderDto} Query options
   *
   * @return result {?} First result of filtering models by query
   */
  async getOne<T>(model: any, options: any = {}): Promise<T> {
    const [result] = ((await this.find(model, options)) as any) || [];

    return result;
  }
}
