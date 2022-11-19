import { join } from "path";
import { Abstract, Type, DynamicModule, ForwardReference, Provider } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { configModule } from "./config";
import { HealthModule } from "./server/modules";
import { isDatabaseEnabled, DatabaseModule } from "./database";
import { servicesFactory } from "./services";
import { trues } from "./constants";

/**
 * Interface defining the property object that describes the module.
 *
 * @see [Modules](https://docs.nestjs.com/modules)
 */
export interface IModuleMetadata {
  /**
   * Optional list of imported modules that export the providers which are
   * required in this module.
   */
  imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  /**
   * Optional list of controllers defined in this module which have to be
   * instantiated.
   */
  controllers: Type<any>[];
  /**
   * Optional list of providers that will be instantiated by the Nest injector
   * and that may be shared at least across this module.
   */
  providers: Provider[];
  /**
   * Optional list of the subset of providers that are provided by this module
   * and should be available in other modules which import this module.
   */
  exports: Array<
    DynamicModule | Promise<DynamicModule> | string | symbol | Provider | ForwardReference | Abstract<any> | Function // eslint-disable-line @typescript-eslint/ban-types
  >;
}

//
// Default module imports
//
export const moduleOptions: IModuleMetadata = {
  exports: [],
  controllers: [],
  imports: [
    // Tools
    configModule,

    // Default Controllers
    HealthModule,
  ],
  providers: [
    // Microservices
    servicesFactory,
  ],
};

//
// Public/Static support
//
if (trues.includes(String(process.env.STATICS_ENABLED).toLowerCase())) {
  moduleOptions.imports.push(
    ServeStaticModule.forRoot({
      serveRoot: process.env.STATICS_SERVE_ROOT || "/public",
      rootPath: join(__dirname, process.env.STATICS_ROOT_PATH || "../public"),
    })
  );
}

//
// Database
//
if (isDatabaseEnabled) {
  moduleOptions.imports.push(DatabaseModule());
}
