import { mergeWith } from "lodash";
import { pagination as buildPagination } from "./pagination";
import { filters as buildFilters } from "./filters";
import { include as buildInclude } from "./include";
import { fields as buildFields } from "./fields";
import { order as buildOrder } from "./order";
import { group as buildGroup } from "./group";
import { sequelizeParser } from "./orm";

//
// helpers
//

/**
 * Merge array values
 */
const mergeArrays = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

//
// source code
//
export const queryParse = (query: any, options: any = {}): any => {
  const pagination = buildPagination(query, options);
  const filters = buildFilters(query, options);
  const fieldsOptions = buildFields(query, options);
  const includeOptions = buildInclude(query, options);
  const orders = buildOrder(query, options);
  const groups = buildGroup(query);
  const opts: any = {};

  // resolve pagination
  if (pagination) {
    opts.limit = pagination.limit;
    opts.offset = pagination.offset;
  }

  // resolve filters as where
  if (filters) {
    opts.where = filters;
  }

  // resolve fields
  if (fieldsOptions) {
    if (fieldsOptions.fields && fieldsOptions.fields.length) {
      opts.attributes = fieldsOptions.fields;
    }
    if (fieldsOptions.relations) {
      opts.relations = mergeWith(opts.relations || {}, fieldsOptions.relations, mergeArrays);
    }
    if (fieldsOptions.remotes && fieldsOptions.remotes.length) {
      opts.remotes = mergeArrays(opts.remotes || [], fieldsOptions.remotes);
    }
  }

  // resolve includes
  if (includeOptions) {
    if (includeOptions.include && includeOptions.include.length) {
      opts.include = includeOptions.include;
    }
    if (includeOptions.relations) {
      opts.relations = mergeWith(opts.relations || {}, includeOptions.relations, mergeArrays);
    }
    if (includeOptions.remotes && includeOptions.remotes.length) {
      opts.remotes = mergeArrays(opts.remotes || [], includeOptions.remotes);
    }
  }

  // resolve order
  if (orders) {
    opts.order = orders;
  }

  // resolve group
  if (groups && groups.length) {
    opts.group = groups;
  }

  // Parse options to sequelize ORM format
  return sequelizeParser(opts);
};
