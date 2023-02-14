import { ConfigModule } from '@nestjs/config';
import services from './services';

//
// constants
//
const baseDir = process.cwd();
const env = process.env.NODE_ENV;

//
// export
//
export const configModule = ConfigModule.forRoot({
    envFilePath: [`${baseDir}/.env`, `${baseDir}/.env.${env}`, `${baseDir}/.env.${env}.local`],
    load: [services],
    isGlobal: true,
});
