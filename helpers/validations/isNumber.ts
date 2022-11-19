import { isEmpty, isNumber as isNumeric } from "lodash";

const regexpNumber = /^[+-]?([0-9]*[.])?[0-9]+$/;

export const isNumber = (value: any) => {
  if (isNumeric(value)) {
    return true;
  }
  return !isEmpty(value) && regexpNumber.test(value);
};
