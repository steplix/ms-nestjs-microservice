import { properties } from "./properties";

//
// source code
//
export const include = (query: any, options: any = {}): any => {
  return properties(query, "include", options);
};
