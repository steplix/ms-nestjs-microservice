import { isObject, isNumber } from "lodash";

//
// constants
//
const defaultPageSize = 0;

//
// helpers
//
const getDefaultPageSize = (options: any): any => {
  if (isNumber(options)) {
    return options;
  }
  return (isObject(options) ? (options as any).pageSize : defaultPageSize) || defaultPageSize;
};

//
// source code
//
export const pagination = (query: any, options: any): any => {
  if (!query) {
    return;
  }

  const pageSize = Number(query.page_size || query.pageSize || getDefaultPageSize(options));
  const page = Number(query.page || 1) - 1;

  if (!pageSize) {
    return;
  }

  return {
    limit: pageSize,
    offset: page * pageSize,
  };
};
