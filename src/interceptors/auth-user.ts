import { type Observable } from 'rxjs';
import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import { Service } from '../services';
import { logger } from '../helpers';
import { isEmpty, isNil } from 'lodash';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
    async intercept<T> (context: ExecutionContext, next: CallHandler): Promise<Observable<T>> {
        const [req] = context.getArgs();

        await this.attachUser(req);
        return next.handle();
    }

    async attachUser (req: Request): Promise<void> {
        const accessToken = this.getAccessToken(req) ?? '';

        if (isEmpty(accessToken)) {
            return;
        }

        const user = await this.getUser(accessToken);

        if (!isNil(user)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (req as any).user = user;
        }
    }

    async getUser (accessToken: string): Promise<unknown> {
        try {
            const authService = Service.get('auth');

            return await authService.get({
                url: '/api/v1/auth/me',
                headers: {
                    authorization: accessToken,
                },
            });
        } catch (e) {
            logger.error(`Can't get user from auth microservice. ${e}`);
            return Promise.resolve();
        }
    }

    getAccessToken (req: Request): string | null {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (req.headers as any).authorization ?? null;
    }
}
