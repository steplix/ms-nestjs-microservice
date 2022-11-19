/// <reference types="lodash" />
/**
 * Service based on axios
 */
export declare class Service {
    private options;
    private connectionTimeout;
    private requestTimeout;
    private r;
    constructor(options?: any);
    request(method: string, options?: any): Promise<unknown>;
    prepareOptions(method: string, options: any): import("lodash").Dictionary<any>;
    health(options?: any): Promise<unknown>;
    getOne(options?: any): Promise<any>;
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
    get(options: any): Promise<unknown>;
    post(options: any): Promise<unknown>;
    put(options: any): Promise<unknown>;
    patch(options: any): Promise<unknown>;
    del(options: any): Promise<unknown>;
    opts(options: any): Promise<unknown>;
    head(options: any): Promise<unknown>;
    connect(options: any): Promise<unknown>;
    trace(options: any): Promise<unknown>;
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
    static add(options?: any): void;
    /**
     * Get service instance.
     */
    static get(name: any): any;
}
