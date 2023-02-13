import 'reflect-metadata';
import { type AxiosRequestConfig } from 'axios';

//
// interface
//
export type ResolveRemoteVarFunction = (...args: unknown[]) => unknown;

export interface IRemoteOptions {
    /**
   * Remote service name
   */
    service?: string | ResolveRemoteVarFunction

    /**
   * URI for call remote service
   */
    uri?: string | ResolveRemoteVarFunction

    /**
   * HTTP Method used for call remote service
   */
    method?: string | ResolveRemoteVarFunction

    /**
   * Axios request config
   */
    options?: AxiosRequestConfig | ResolveRemoteVarFunction

    /**
   * Indicates whether the dependency is mandatory or not
   */
    required?: boolean | ResolveRemoteVarFunction

    /**
   * Indicates if the error should be printed if the request does not fail
   */
    silent?: boolean | ResolveRemoteVarFunction

    /**
   * Remote field to resolve
   */
    remoteField?: string
}

//
// decorator
//
// eslint-disable-next-line @typescript-eslint/ban-types
export function Remote (): Function;

// eslint-disable-next-line @typescript-eslint/ban-types
export function Remote (options: IRemoteOptions): Function;

// eslint-disable-next-line @typescript-eslint/ban-types
export function Remote (...args: unknown[]): Function {
    const options = args[0] ?? {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target: any, memberName: string) => {
        Reflect.defineMetadata(`remote_${memberName}`, options, target, memberName);
    };
}
