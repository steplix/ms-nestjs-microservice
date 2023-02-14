import { isString, isArray, merge } from 'lodash';
import { Injectable, ServiceUnavailableException, GatewayTimeoutException, InternalServerErrorException } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosRequestConfig, type CreateAxiosDefaults, type ResponseType } from 'axios';

//
// constants
//

// default service agent
// const defaultServiceAgent = process.env.SERVICE_AGENT || "";

// must be greater than requestTimeout
const defaultConnectionTimeout = +(process.env.SERVICE_CONNECTION_TIMEOUT ?? 21000);
const defaultRequestTimeout = +(process.env.SERVICE_REQUEST_TIMEOUT ?? 20000);

// constants for connections errors
const connectionErrors = ['ECONNREFUSED', 'ENETUNREACH'];

//
// variables
//
const instances = {};
const defaultAddOptions = {
    responseType: 'json' as ResponseType
};

interface IOptions<D = unknown> extends CreateAxiosDefaults<D> {
    connectionTimeout?: number
    requestTimeout?: number
    name?: string
    health?: string
}

/**
 * Service based on axios
 */
@Injectable()
export class Service {
    //
    // private
    //
    private readonly r: AxiosInstance;

    //
    // public
    //
    readonly options: IOptions;

    constructor (options: string | IOptions = {}) {
        this.options = this.urlToOptions(options);
        this.options.connectionTimeout ??= defaultConnectionTimeout;
        this.options.timeout ??= this.options.requestTimeout ?? defaultRequestTimeout;
        this.r = axios.create(this.options);
    }

    request<T> (method: string, options: string | IOptions = {}): Promise<T> {
        return new Promise((resolve, reject): void => {
            const opts = this.prepareOptions(method, options);

            this.r
                .request(opts)
                .then((res) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve((opts as any).raw !== undefined ? res : res.data);
                })
                .catch((error) => {
                    const extra = {
                        from: this.options.name,
                        path: opts.url,
                        method: opts.method,
                    };

                    if (axios.isAxiosError(error)) {
                        if (error.response !== undefined) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (error as any).extra = extra;
                            reject(error);
                            return;
                        }

                        if (connectionErrors.includes(error.code ?? '')) {
                            reject(new ServiceUnavailableException({ message: 'Service Unavailable. Try again later.', extra }));
                            return;
                        }
                        throw new GatewayTimeoutException({ message: 'Timeout Error. Try again later.', extra });
                    } else {
                        if (error.__CANCEL__ !== undefined) {
                            // The service is unreachable (connection timeout)
                            throw new ServiceUnavailableException({ message: 'Service Unavailable. Try again later.', extra });
                        }
                        // Something happened in setting up the request and triggered an Error
                        throw new InternalServerErrorException({ extra, error });
                    }
                });
        });
    }

    prepareOptions (method: string, options: string | IOptions): AxiosRequestConfig {
        options = this.urlToOptions(options);
        // set default methods and headers
        options.method = method ?? 'get';
        options.headers = merge({}, options.headers ?? {});

        const connectionTimeout = options.connectionTimeout ?? this.options.connectionTimeout;

        // set of connection timeout cancel token
        const source = axios.CancelToken.source();
        setTimeout(() => { source.cancel(); }, connectionTimeout);
        options.cancelToken = source.token;

        return options as AxiosRequestConfig;
    }

    health<T> (options: IOptions = {}): Promise<T> {
        options.url = options.url ?? this.options.health ?? '/health';
        return this.get(options);
    }

    getOne<T> (options: string | IOptions = {}): Promise<T> {
        options = this.urlToOptions(options);
        options.params = options.params ?? {};
        options.params.pageSize = 1;
        options.params.page = 1;

        return this.get<T[]>(options).then((models) => {
            models = models ?? [];

            if (!isArray(models)) {
                return models;
            }

            return models[0];
        });
    }

    /**
   * Transform all http methods on service function
   *
   * service.get
   * service.post
   * service.put
   * service.patch
   * service.delete
   * service.options
   * service.head
   * service.connect
   * service.trace
   */

    get<T = unknown> (options: string | IOptions = {}): Promise<T> {
        return this.request<T>('get', options);
    }

    post<T = unknown, D = unknown> (options: string | IOptions<D> = {}): Promise<T> {
        return this.request<T>('post', options);
    }

    put<T = unknown, D = unknown> (options: string | IOptions<D> = {}): Promise<T> {
        return this.request<T>('put', options);
    }

    patch<T = unknown, D = unknown> (options: string | IOptions<D> = {}): Promise<T> {
        return this.request<T>('patch', options);
    }

    del<T = unknown, D = unknown> (options: string | IOptions<D> = {}): Promise<T> {
        return this.request<T>('delete', options);
    }

    opts<T = unknown> (options: string | IOptions = {}): Promise<T> {
        return this.request<T>('options', options);
    }

    head<T = unknown> (options: string | IOptions = {}): Promise<T> {
        return this.request<T>('head', options);
    }

    connect<T = unknown> (options: string | IOptions = {}): Promise<T> {
        return this.request<T>('connect', options);
    }

    trace<T = unknown> (options: string | IOptions = {}): Promise<T> {
        return this.request<T>('trace', options);
    }

    /**
   * Add read only service property.
   *
   * @param  Object  service  Options for service
   * @example
   *   service.add({
   *     baseURL: 'https://myservice.mydomain.com',
   *     name: 'myService',
   *     port: 8081
   *   })
   */
    static add (options: IOptions = {}): void {
        options = { ...defaultAddOptions, ...options };

        // Check if need add service, verify options with name.
        if (options.name === undefined) return;

        // Add service with options.name
        Object.defineProperty(Service, options.name, {
            configurable: true,
            enumerable: true,
            get: () => {
                if (options.name === undefined) return;

                let instance = instances[options.name];

                if (instance === undefined) {
                    instance = instances[options.name] = new Service(options);
                }
                return instance;
            },
        });
    }

    /**
   * Get service instance.
   */
    static get (name: string): Service {
        return instances[name] as Service;
    }

    private urlToOptions (options: string | IOptions): IOptions {
        if (isString(options)) {
            options = {
                url: options,
            };
        }

        return options;
    }
}
