import { each, find, isString, isEmpty } from "lodash";

//
// constants
//
const fieldSeparator = ".";

//
// source code
//
export const sequelizeParser = (opts: any): any => {
  // Resolve include option
  resolveInclude(opts);

  // Resolve where option
  resolveWhere(opts);

  return opts;
};

//
// helpers
//

/**
 * Resolve include option
 */
const resolveInclude = (opts: any): any => {
  if (!opts || !opts.include) {
    return opts;
  }

  const relations = opts.relations || {};

  // Associate model
  opts.include = opts.include.map((association) => {
    if (!isString(association)) {
      return association;
    }

    // Resolve relations for this association
    return resolveInclude({
      // Associate model
      association,
      // Extra options for this include association
      ...(relations[association] || {}),
    });
  });
  return opts;
};

/**
 * Resolve where option
 */
const resolveWhere = (opts: any): any => {
  if (!opts || !opts.where) {
    return opts;
  }

  const filters = opts.where;

  opts.where = {};

  // Associate model
  each(filters, (condition: any, key: any) => {
    if (!isString(key)) {
      return;
    }
    resolveWhereCondition(opts, key, condition);
  });

  // Clean
  if (isEmpty(opts.where)) {
    delete opts.where;
  }

  return opts;
};

/**
 * Resolve where nested condition
 */
const resolveWhereCondition = (opts: any, key: string, condition: any): any => {
  if (!key.includes(fieldSeparator)) {
    opts.where = opts.where || {};
    opts.where[key] = condition;
    opts.required = true;
    return opts;
  }

  const [association] = key.split(fieldSeparator);
  const nextKey = key.replace(`${association}.`, "");
  let relation = find(opts.include, ["association", association]);

  if (!relation) {
    relation = { association };
    opts.include = opts.include || [];
    opts.include.push(relation);
  }

  return resolveWhereCondition(relation, nextKey, condition);
};
