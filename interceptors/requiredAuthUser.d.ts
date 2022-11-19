import { AuthUserInterceptor } from "./authUser";
export declare class RequiredAuthUserInterceptor extends AuthUserInterceptor {
    attachUser(req: Request): Promise<void>;
}
