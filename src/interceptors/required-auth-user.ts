import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { isEmpty, isNil } from 'lodash';
import { AuthUserInterceptor } from './auth-user';

@Injectable()
export class RequiredAuthUserInterceptor extends AuthUserInterceptor {
    async attachUser (req: Request): Promise<void> {
        const accessToken = this.getAccessToken(req) ?? '';

        if (isEmpty(accessToken)) {
            throw new HttpException(
                {
                    message: 'No autorizado',
                    extra: {
                        code: 'NO_ACCESS_TOKEN',
                    },
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const user = await this.getUser(accessToken);

        if (!isNil(user)) {
            throw new HttpException(
                {
                    message: 'No autorizado',
                    extra: {
                        code: 'NO_USER_FOR_ACCESS_TOKEN',
                    },
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).user = user;
    }
}
