import { isEmpty, isNumber as isNumeric } from 'lodash';

const regexpNumber = /^[+-]?(\d*[.])?\d+$/;

export const isNumber = (value: string): boolean => {
    if (isNumeric(value)) {
        return true;
    }
    return !isEmpty(value) && regexpNumber.test(value);
};
