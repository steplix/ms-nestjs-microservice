import { Observable } from "rxjs";
import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
export declare class AuthUserInterceptor implements NestInterceptor {
    intercept<T>(context: ExecutionContext, next: CallHandler): Promise<Observable<T>>;
    attachUser(req: Request): Promise<void>;
    getUser(accessToken: string): Promise<any>;
    getAccessToken(req: Request): string | null;
}
