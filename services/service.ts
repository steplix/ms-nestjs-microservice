import { isString, isArray, merge, mapKeys } from "lodash";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

//
// constants
//

// default service agent
// const defaultServiceAgent = process.env.SERVICE_AGENT || "";

// must be greater than requestTimeout
const defaultConnectionTimeout = +(process.env.SERVICE_CONNECTION_TIMEOUT || 21000);
const defaultRequestTimeout = +(process.env.SERVICE_REQUEST_TIMEOUT || 20000);

// constants for connections errors
const connectionErrors = ["ECONNREFUSED", "ENETUNREACH"];

//
// variables
//

const instances = {};
const renameMapKeys = {
  baseUrl: "baseURL",
  uri: "url",
  qs: "params",
  body: "data",
};
const defaultAddOptions = {
  responseType: "json",
  debug: false,
};

/**
 * Service based on axios
 */
@Injectable()
export class Service {
  //
  // private
  //

  private options: any;
  private connectionTimeout: number;
  private requestTimeout: number;
  private r: AxiosInstance;

  //
  // public
  //

  constructor(options: any = {}) {
    this.options = options;
    this.connectionTimeout = options.connectionTimeout || defaultConnectionTimeout;
    this.requestTimeout = options.requestTimeout || defaultRequestTimeout;
    this.r = axios.create(this.options as AxiosRequestConfig);
  }

  request(method: string, options: any = {}) {
    return new Promise((resolve, reject) => {
      const opts = this.prepareOptions(method, options);

      return this.r
        .request(opts)
        .then((res) => resolve(opts.raw ? res : res.data))
        .catch((error) => {
          const extra = {
            from: (this.r.defaults as any).name,
            path: opts.url,
            method: opts.method,
          };

          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx.
             * Convert axios error to @comodinx/http-errors
             * Throw error to be handled outside this abstract method
             */
            error.extra = extra;
            return reject(error);
          } else if (error.request) {
            // The request was made but no response was received, `error.request`
            if (connectionErrors.includes(error.code)) {
              // no conection made
              return reject(
                new HttpException(
                  { message: "Service Unavailable. Try again later.", extra },
                  HttpStatus.SERVICE_UNAVAILABLE
                )
              );
            }
            // timeout error
            return reject(
              new HttpException({ message: "Timeout Error. Try again later.", extra }, HttpStatus.GATEWAY_TIMEOUT)
            );
          } else {
            if (error.__CANCEL__) {
              // The service is unreachable (connection timeout)
              return reject(
                new HttpException(
                  { message: "Service Unavailable. Try again later.", extra },
                  HttpStatus.SERVICE_UNAVAILABLE
                )
              );
            }
            // Something happened in setting up the request and triggered an Error
            error.extra = extra;
            return reject(
              new HttpException({ message: "Internal Server Error", extra: error }, HttpStatus.INTERNAL_SERVER_ERROR)
            );
          }
        });
    });
  }

  prepareOptions(method: string, options: any) {
    if (isString(options)) {
      options = {
        url: options,
      };
    }

    // set default methods and headers
    options.method = method || "get";
    options.headers = merge({}, options.headers || {});

    // set request timeout
    options.timeout = options.timeout || this.requestTimeout;

    // set of connection timeout cancel token
    const source = axios.CancelToken.source();
    const connectionTimeout = options.connectionTimeout || this.connectionTimeout;
    setTimeout(() => source.cancel(), connectionTimeout);
    options.cancelToken = source.token;

    return mapKeys(options, (value, key) => renameMapKeys[key] || key);
  }

  health(options: any = {}) {
    options.url = options.url || options.uri || this.options.health || "/health";
    return this.get(options);
  }

  getOne(options: any = {}) {
    if (isString(options)) {
      options = {
        url: options,
      };
    }

    options = options || {};

    if (options.qs) {
      options.params = options.qs;
    }

    options.params = options.params || {};
    options.params.pageSize = 1;
    options.params.page = 1;

    return this.get(options).then((models) => {
      models = models || [];

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

  get(options) {
    return this.request("get", options);
  }

  post(options) {
    return this.request("post", options);
  }

  put(options) {
    return this.request("put", options);
  }

  patch(options) {
    return this.request("patch", options);
  }

  del(options) {
    return this.request("delete", options);
  }

  opts(options) {
    return this.request("options", options);
  }

  head(options) {
    return this.request("head", options);
  }

  connect(options) {
    return this.request("connect", options);
  }

  trace(options) {
    return this.request("trace", options);
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
  static add(options: any = {}) {
    options = { ...defaultAddOptions, ...options };

    // Check if need add service, verify options with name.
    if (!options.name) {
      return;
    }

    // Add service with options.name
    Object.defineProperty(Service, options.name, {
      configurable: true,
      enumerable: true,
      get: function () {
        let instance = instances[options.name];

        if (!instance) {
          /*
            //
            // TODO :: Verify if this is very very necesary.
            //

            if (!options.httpAgent) {
                options.httpAgent = new ServiceAgent({
                    service: defaultServiceAgent
                });
            }
          */
          instance = instances[options.name] = new Service(options);
        }
        return instance;
      },
    });
  }

  /**
   * Get service instance.
   */
  static get(name) {
    return (Service as any)[name];
  }
}
