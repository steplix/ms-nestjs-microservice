import "reflect-metadata";
import { AxiosRequestConfig } from "axios";
export type ResolveRemoteVarFunction = (...args: any[]) => any;
export interface IRemoteOptions {
    /**
     * Remote service name
     */
    service?: string | ResolveRemoteVarFunction;
    /**
     * URI for call remote service
     */
    uri?: string | ResolveRemoteVarFunction;
    /**
     * HTTP Method used for call remote service
     */
    method?: string | ResolveRemoteVarFunction;
    /**
     * Axios request config
     */
    options?: AxiosRequestConfig | ResolveRemoteVarFunction;
    /**
     * Indicates whether the dependency is mandatory or not
     */
    required?: boolean | ResolveRemoteVarFunction;
    /**
     * Indicates if the error should be printed if the request does not fail
     */
    silent?: boolean | ResolveRemoteVarFunction;
    /**
     * Remote field to resolve
     */
    remoteField?: string;
}
export declare function Remote(): Function;
export declare function Remote(options: IRemoteOptions): Function;
