import { isEmpty, isInteger as isInt } from 'lodash';

const regexpInteger = /^(?:[-+]?(?:0|[1-9]\d*))$/;

export const isInteger = (value: string): boolean => {
    if (isInt(value)) {
        return true;
    }
    return !isEmpty(value) && regexpInteger.test(value);
};
