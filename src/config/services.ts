import { snakeCase, merge, isUndefined } from 'lodash';

interface Service {
    name: string
    health: string
    responseType: XMLHttpRequestResponseType
    baseURL: string
    debug: boolean
    port: number
    timeout: {
        connection: number
        request: number
    }
}

//
// constants
//

// By default NODE_ENV is always used. But in applications built with react, said can only take 2 possible values (development or production)
// For this reason we support: APP_ENV or APP_NODE_ENV
const env = process.env.APP_ENV ?? process.env.APP_NODE_ENV ?? process.env.NODE_ENV;
const debug = env !== 'production';

// Tuples with service name and port
const remoteServices = [
    { service: 'auth', port: 3001 },
    { service: 'users', port: 3002 },
    { service: 'locations', port: 3003 },
    { service: 'notifications', port: 3004 },
    { service: 'feature_toggler', port: 3005 },
];

// Define service timeout
const defaultOptions = {
    timeout: {
    // must be greater than requestTimeout
        connection: +(process.env.SERVICE_CONNECTION_TIMEOUT ?? 21000),
        request: +(process.env.SERVICE_REQUEST_TIMEOUT ?? 20000),
    },
};

//
// helpers
//
const buildServices = (services: Array<{ service: string, port: number, url?: string }>): Record<string, Service> => {
    const carry = {};

    services.forEach(
        ({ service, port, url }) => {
            const key = snakeCase(service).toUpperCase();
            const baseURL =
                // Check if has programmatic service url.
                url ??
                // Check if has custom service url.
                getFullServiceUrl(`SERVICE_${key}_URL`) ??
                // Check if has generic load balancer url.
                getBaseServiceUrl('SERVICE_BASE_MS_URL', port) ??
                getBaseServiceUrl('SERVICE_BASE_URL', port) ??
                // Check if has internal AWS pods URL.
                getInternalServiceUrl(key) ??
                // In default case, build localhost url.
                `http://localhost:${port}`;

            const name = service;

            // Default options for build axios client.
            carry[name] = merge({}, defaultOptions, {
                health: process.env[`SERVICE_${key}_HEALTH`] ?? process.env.SERVICE_HEALTH ?? '/health',
                responseType: 'json',
                baseURL,
                debug,
                name,
                port
            });
        }
    );

    return carry;
};

/**
 * Resolve full service url
 */
const getFullServiceUrl = (key: string): string | undefined => {
    return process.env[key];
};

/**
 * Resolve base service url
 */
const getBaseServiceUrl = (key: string, port: number): string | undefined => {
    if (process.env[key] === undefined) {
        return;
    }
    return `${process.env[key]}:${port}`;
};

/**
 * Resolve full internal service url
 */
const getInternalServiceUrl = (prefixService: string): string | undefined => {
    return (
        getFullServiceUrl(`${prefixService}_URL`) ??
        getInternalServiceUrlWithPort(`${prefixService}_SERVICE_HOST`, `${prefixService}_SERVICE_PORT`)
    );
};

/**
 * Resolve full internal service url+port
 *
 * Check if has internal AWS pods URL.
 * For example:
 *   http://[R2|OPS]_[SERVICE]_BACKEND_SERVICE_HOST:[R2|OPS]_[SERVICE]_BACKEND_SERVICE_PORT_HTTP
 */
const getInternalServiceUrlWithPort = (keyHost: string, keyPort: string): string | undefined => {
    const host = process.env[keyHost];
    const port = process.env[keyPort];
    if (host === undefined) {
        return;
    }
    if (isUndefined(port) || port === '80') {
        return `http://${host}`;
    }

    return `http://${host}:${port}`;
};

//
// export
//
export default (): { services: Record<string, Service> } => ({
    services: {
        ...buildServices(remoteServices),
    },
});
