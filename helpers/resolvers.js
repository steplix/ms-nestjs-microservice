"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePossibleFunctionValue = exports.resolveEnvVarByApp = exports.resolveEnvVarWithPrefix = exports.resolveEnvVar = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(`${process.cwd()}/package.json`);
/**
 * Resolve environment variable on process. In undefined case, return "defaultValue".
 *
 * Examples,
 *  ```
 *    resolveEnvVar('DOC_SWAGGER_TITLE')
 *    // return value of -> process.env.DOC_SWAGGER_TITLE
 *  ```
 *
 *  ```
 *    resolveEnvVar('NOT_FOUND_VAR_NAME', 'Steplix')
 *    // return default value -> 'Steplix'
 *  ```
 *
 * @note we transform the "key" into uppercase.
 *
 * @param key {string} Environment variable name
 * @param defaultValue {any} Default value
 *
 * @return process environment value or default value
 */
const resolveEnvVar = (key, defaultValue = null) => {
    return process.env[key.toUpperCase()] || defaultValue;
};
exports.resolveEnvVar = resolveEnvVar;
/**
 * Resolve environment variable on process. In undefined case, return "defaultValue".
 *
 * Examples,
 *  ```
 *    resolveEnvVarWithPrefix('DOC_SWAGGER_TITLE', 'STEPLIX_payments')
 *    // return value of -> process.env.STEPLIX_PAYMENTS_DOC_SWAGGER_TITLE || process.env.DOC_SWAGGER_TITLE
 *  ```
 *
 *  ```
 *    resolveEnvVarWithPrefix('NOT_FOUND_VAR_NAME', 'STEPLIX_payments', 'Steplix')
 *    // return default value -> 'Steplix'
 *  ```
 *
 * @note we transform the "key" and "prefix" into uppercase
 *
 * @param key {string} Environment variable name
 * @param prefix {string} Possible environment variable prefix
 * @param defaultValue {any} Default value
 *
 * @return process environment value or default value
 */
const resolveEnvVarWithPrefix = (key, prefix = "", defaultValue = null) => {
    return process.env[`${prefix}_${key}`.toUpperCase()] || (0, exports.resolveEnvVar)(key, defaultValue);
};
exports.resolveEnvVarWithPrefix = resolveEnvVarWithPrefix;
/**
 * Resolve environment variable on process. In undefined case, return "defaultValue".
 *
 * Examples,
 *  ```
 *    resolveEnvVarByApp('DOC_SWAGGER_TITLE')
 *    // return value of -> process.env.STEPLIX_PAYMENTS_DOC_SWAGGER_TITLE || process.env.DOC_SWAGGER_TITLE
 *  ```
 *
 *  ```
 *    resolveEnvVarByApp('NOT_FOUND_VAR_NAME', 'Steplix')
 *    // return default value -> 'Steplix'
 *  ```
 *
 * @note we transform the "key" and "prefix" into uppercase
 *
 * @param key {string} Environment variable name
 * @param defaultValue {any} Default value
 *
 * @return process environment value or default value
 */
const resolveEnvVarByApp = (key, defaultValue = null) => {
    return (0, exports.resolveEnvVarWithPrefix)(key, pkg.name, defaultValue);
};
exports.resolveEnvVarByApp = resolveEnvVarByApp;
/**
 * Resolve any type or function value. In undefined case, return "defaultValue".
 *
 * Examples,
 *  ```
 *    resolvePossibleFunctionValue('my-string-value')
 *    // return -> 'my-string-value'
 *  ```
 *
 *  ```
 *    resolvePossibleFunctionValue(null, 'Steplix')
 *    // return -> 'Steplix'
 *  ```
 *
 *  ```
 *    const options = {
 *     uri: (id) => `/api/v1/users/${id}`
 *    };
 *    ...
 *    resolvePossibleFunctionValue(options.uri, '/api/v1/users', 1)
 *    // return -> '/api/v1/users/1'
 *  ```
 *
 *  ```
 *    const options = {
 *     uri: () => null
 *    };
 *    ...
 *    resolvePossibleFunctionValue(options.uri, '/api/v1/users', 1)
 *    // return -> '/api/v1/users'
 *  ```
 *
 * @param value {string | function} Variable we want to solve
 * @param defaultValue {any} Default value in case of not being able to resolve the value
 * @param args {any[]} Argument used in case the value is of type function
 *
 * @return {any} Result of solving the value
 */
const resolvePossibleFunctionValue = (value, defaultValue, ...args) => {
    if (typeof value === "function") {
        value = value(...args);
    }
    // == null is nil comparation (null or undefined)
    return value == null ? defaultValue : value;
};
exports.resolvePossibleFunctionValue = resolvePossibleFunctionValue;
