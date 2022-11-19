"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
//
// constants
//
// By default NODE_ENV is always used. But in applications built with react, said can only take 2 possible values (development or production)
// For this reason we support: APP_ENV or APP_NODE_ENV
const env = process.env.APP_ENV || process.env.APP_NODE_ENV || process.env.NODE_ENV;
const debug = env !== "production";
// Tuples with service name and port
const remoteServices = [
    ["auth", 3001],
    ["users", 3002],
    ["locations", 3003],
    ["notifications", 3004],
    ["feature_toggler", 3005],
];
// Define service timeout
const defaultOptions = {
    timeout: {
        // must be greater than requestTimeout
        connection: +(process.env.SERVICE_CONNECTION_TIMEOUT || 21000),
        request: +(process.env.SERVICE_REQUEST_TIMEOUT || 20000),
    },
};
//
// helpers
//
const reducer = (services) => {
    return (0, lodash_1.reduce)(services, (carry, [service, port, url]) => {
        const key = (0, lodash_1.snakeCase)(service).toUpperCase();
        const baseURL = 
        // Check if has programmatic service url.
        url ||
            // Check if has custom service url.
            getFullServiceUrl(`SERVICE_${key}_URL`) ||
            // Check if has generic load balancer url.
            getBaseServiceUrl("SERVICE_BASE_MS_URL", port) ||
            getBaseServiceUrl("SERVICE_BASE_URL", port) ||
            // Check if has internal AWS pods URL.
            getInternalServiceUrl(key) ||
            // In default case, build localhost url.
            `http://localhost:${port}`;
        const name = service;
        // Default options for build axios client.
        carry[name] = (0, lodash_1.merge)({}, defaultOptions, {
            health: process.env[`SERVICE_${key}_HEALTH`] || process.env.SERVICE_HEALTH || "/health",
            responseType: "json",
            baseURL,
            debug,
            name,
            port,
        });
        return carry;
    }, {});
};
/**
 * Resolve full service url
 */
const getFullServiceUrl = (key) => {
    return process.env[key];
};
/**
 * Resolve base service url
 */
const getBaseServiceUrl = (key, port) => {
    if (!process.env[key]) {
        return null;
    }
    return `${process.env[key]}:${port}`;
};
/**
 * Resolve full internal service url
 */
const getInternalServiceUrl = (prefixService) => {
    return (getFullServiceUrl(`${prefixService}_URL`) ||
        getInternalServiceUrlWithPort(`${prefixService}_SERVICE_HOST`, `${prefixService}_SERVICE_PORT`));
};
/**
 * Resolve full internal service url+port
 *
 * Check if has internal AWS pods URL.
 * For example:
 *   http://[R2|OPS]_[SERVICE]_BACKEND_SERVICE_HOST:[R2|OPS]_[SERVICE]_BACKEND_SERVICE_PORT_HTTP
 */
const getInternalServiceUrlWithPort = (keyHost, keyPort) => {
    if (!process.env[keyHost]) {
        return null;
    }
    const port = +process.env[keyPort];
    if (isNaN(port) || port === 80) {
        return `http://${process.env[keyHost]}`;
    }
    return `http://${process.env[keyHost]}:${process.env[keyPort]}`;
};
//
// export
//
exports.default = () => ({
    services: {
        ...reducer(remoteServices),
    },
});
