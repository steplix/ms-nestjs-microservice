import {
  isEmpty,
  isArray,
  isString,
  isObject,
  isNumber,
  isBoolean,
  startsWith,
  reduce,
  merge,
  find,
  map,
} from "lodash";
import { Op, where, literal } from "sequelize";
import { Parser, Mappers } from "@comodinx/query-filters";
import { trues, booleans } from "../../constants/booleans";

//
// constants
//
// operator mappers
const mapOperator = {
  eq: Op.eq,
  ee: "ee",
  ne: Op.ne,
  gt: Op.gt,
  ge: Op.gte,
  lt: Op.lt,
  le: Op.lte,
  li: Op.like,
  nl: Op.notLike,
  in: Op.in,
  ni: Op.notIn,
  be: Op.between,
  nb: Op.notBetween,
  is: Op.is,
  no: Op.not,
};
// filter separator
const defaultSeparator = ",";
// eslint-disable-next-line no-useless-escape
const key = "[A-Za-z0-9_.]+";
// eslint-disable-next-line no-useless-escape
const valueLikeParse = /\*/g;
// eslint-disable-next-line no-useless-escape
const valueLikeFormat = /\%/g;

// Json keys
const defaultJsonKeys = ["metadata"];

// Extends mappers on @comodinx/query-filters
Mappers.Sequelize = mapOperator;

//
// helpers
//
const isNumberString = (value: any): boolean => {
  if (isNumber(value)) {
    return true;
  }
  return !isEmpty(value) && !isNaN(Number(value));
};

const isBooleanString = (value: any): boolean => {
  return !isEmpty(value) && booleans.includes(String(value).toLowerCase());
};

const mapValueParse = (value: any, operator: string): any => {
  // exact equal
  if (operator.trim() === "ee") {
    return value;
  }

  // is or is not
  if (operator.trim() === "is" || operator.trim() === "no") {
    if (value === "null" || value === "undefined") {
      return null;
    }
    return value;
  }

  if (isArray(value)) {
    return map(value, (value) => mapValueParse(value, operator));
  }

  if (isNumberString(value)) {
    return Number(value);
  }
  if (isBoolean(value)) {
    return value;
  }
  if (isBooleanString(value)) {
    return trues.includes(String(value).toLowerCase());
  }
  if (isString(value)) {
    return value.replace(valueLikeParse, "%");
  }
  return value;
};

const mapValueFormat = (value: any, operator: string): any => {
  if (isArray(value)) {
    return `[${value.map((value) => mapValueFormat(value, operator)).join(";")}]`;
  }
  if (isObject(value)) {
    return JSON.stringify(value);
  }
  if (isString(value)) {
    return value.replace(valueLikeFormat, "*");
  }
  return value;
};

const createParser = (options: any = {}): any => {
  return new Parser(
    merge(
      {},
      {
        separator: defaultSeparator,
        mapValueFormat,
        mapValueParse,
        mapOperator,
        key,
      },
      options
    )
  );
};

//
// source code
//
export const filters = (query: any, options: any = {}): any => {
  // Save last parser instance.
  const parser = ((filters as any).lastParser = createParser(
    merge(
      {},
      {
        separator: (query && query.filtersSeparator) || defaultSeparator,
      },
      options || {}
    )
  ));

  if (!query || !query.filters || isEmpty(query.filters)) {
    return;
  }

  const parsed = parser.parse(query.filters);

  if (!parsed) {
    return;
  }

  const jsonKeys = options.jsonKeys || defaultJsonKeys;

  return reduce(
    parsed,
    (carry: any, condition: any, key: string) => {
      const jsonKey = find(jsonKeys, (jsonKey) => startsWith(key, `${jsonKey}.`));

      if (jsonKey) {
        carry[Op.and] = carry[Op.and] || [];
        carry[Op.and].push(where(literal(`${jsonKey}->"$${key.replace(jsonKey, "")}"`), condition));
      } else {
        carry[key] = condition;
      }
      return carry;
    },
    {}
  );
};

filters.createParser = createParser;
