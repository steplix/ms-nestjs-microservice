import { Observable } from "rxjs";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Service } from "../services";
import { logger } from "../helpers";

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  async intercept<T>(context: ExecutionContext, next: CallHandler): Promise<Observable<T>> {
    const [req] = context.getArgs();

    await this.attachUser(req);
    return next.handle();
  }

  async attachUser(req: Request) {
    const accessToken = this.getAccessToken(req);

    if (!accessToken) {
      return;
    }

    const user = await this.getUser(accessToken);

    if (user) {
      (req as any).user = user;
    }
  }

  async getUser(accessToken: string): Promise<any> {
    try {
      const authService = Service.get("auth");

      return await authService.get({
        uri: "/api/v1/auth/me",
        headers: {
          authorization: accessToken,
        },
      });
    } catch (e) {
      logger.error(`Can't get user from auth microservice. ${e}`);
      return Promise.resolve();
    }
  }

  getAccessToken(req: Request): string | null {
    return req.headers["authorization"] || null;
  }
}
