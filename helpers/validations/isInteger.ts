import { isEmpty, isInteger as isInt } from "lodash";

const regexpInteger = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;

export const isInteger = (value: any) => {
  if (isInt(value)) {
    return true;
  }
  return !isEmpty(value) && regexpInteger.test(value);
};
