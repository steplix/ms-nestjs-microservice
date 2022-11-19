import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { AuthUserInterceptor } from "./authUser";

@Injectable()
export class RequiredAuthUserInterceptor extends AuthUserInterceptor {
  async attachUser(req: Request) {
    const accessToken = this.getAccessToken(req);

    if (!accessToken) {
      throw new HttpException(
        {
          message: "No autorizado",
          extra: {
            code: "NO_ACCESS_TOKEN",
          },
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const user = await this.getUser(accessToken);

    if (!user) {
      throw new HttpException(
        {
          message: "No autorizado",
          extra: {
            code: "NO_USER_FOR_ACCESS_TOKEN",
          },
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    (req as any).user = user;
  }
}
