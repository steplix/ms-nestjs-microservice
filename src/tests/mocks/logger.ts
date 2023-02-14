import { LoggerService } from '@nestjs/common';

export class LoggerMock implements LoggerService {
    log(message: string): any { /* mocking */ }
    error(message: string, trace: string): any { /* mocking */ }
    warn(message: string): any { /* mocking */ }
    debug(message: string): any { /* mocking */ }
    verbose(message: string): any { /* mocking */ }
}
