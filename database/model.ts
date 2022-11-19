import "reflect-metadata";
import pluralize from "pluralize";
import { Model as BaseModel, AfterFind } from "sequelize-typescript";
import { logger, resolvePossibleFunctionValue } from "../helpers";
import { IRemoteOptions } from "../decorators";
import { Service } from "../services";

//
// main class
//

/**
 * Abstract model
 */
export abstract class Model<T> extends BaseModel<T> {
  /**
   * Sequelize hook for before find function
   */
  @AfterFind
  static async afterFindHook(models: any, options: any) {
    if (!models) {
      return;
    }

    models = Array.isArray(models) ? models : [models];

    for (const model of models) {
      if (!model) {
        continue;
      }

      // Check if need resolve includes
      if (options.include && options.include.length) {
        await Model.resolveIncludes(model, options);
      }

      // Check if need resolve remotes
      if (options.remotes) {
        await Model.resolveRemotes(model, options);
      }
    }
  }

  /**
   * Resolve include relationships
   */
  static async resolveIncludes(model: any, findOptions: any) {
    const relations = findOptions.relations || {};

    for (const includeOptions of findOptions.include) {
      const include = includeOptions.as;
      const related = model[include];

      if (related && includeOptions.model.afterFindHook) {
        await includeOptions.model.afterFindHook(related, relations[include] || {});
      }
    }
  }

  /**
   * Resolve remote relationships
   */
  static async resolveRemotes(model: any, findOptions: any) {
    for (const remote of findOptions.remotes) {
      const remoteOptions: IRemoteOptions = Reflect.getMetadata(`remote_${remote}`, model, remote);

      if (remoteOptions) {
        await Model.resolveRemote(model, findOptions, remote, remoteOptions);
      }
    }
  }

  /**
   * Resolve remote relationship
   */
  static async resolveRemote(model: any, findOptions: any, remoteField: string, remoteOptions: IRemoteOptions) {
    let { service, uri, method } = remoteOptions;
    const relationship = remoteOptions.remoteField || pluralize(remoteField);

    // 01. Resolve remote service, by service name.
    const serviceName = resolvePossibleFunctionValue(service, relationship, model, findOptions);

    service = Service.get(serviceName);

    if (!service) {
      logger.warn(`Remote service ${serviceName} does not exists`);
      return;
    }

    // 02. Resolve request find options
    const relations = findOptions.relations || {};
    const args = { model, options: findOptions };
    let options = remoteOptions.options;

    uri = resolvePossibleFunctionValue(uri, `/api/v1/${relationship}`, args) as string;
    method = resolvePossibleFunctionValue(method, "get", args) as string;
    options = resolvePossibleFunctionValue(options, {}, args) as any;

    // 03. Try to call endpoint with resolved variables
    try {
      model.setDataValue(
        remoteField,
        await service[method]({
          uri,
          ...(await Model.resolveRemoteRequestOptions(relations[remoteField], options)),
        })
      );
    } catch (e) {
      const { required, silent } = remoteOptions;

      // 03. a. Check if this attribute is required
      if (resolvePossibleFunctionValue(required, true, args)) {
        logger.error(
          `Cant load remote value for ${remoteField} from ${method} ${uri} with data ${JSON.stringify(options)}`,
          e
        );
        throw e;
      }

      // 03. b. Check if is necesary debug warning when call fail
      if (!resolvePossibleFunctionValue(silent, false, args)) {
        logger.warn(
          `Cant load remote value for ${remoteField} from ${method} ${uri} with data ${JSON.stringify(options)}`
        );
      }
    }
  }

  /**
   * Resolve remote options for relationship
   */
  static async resolveRemoteRequestOptions(remoteOptions: any, defaultOptions: any) {
    let includes;
    let remotes;

    if (remoteOptions) {
      includes = await Model.resolveRemoteRequestOptionsForIncludes(remoteOptions);
      remotes = await Model.resolveRemoteRequestOptionsForRemotes(remoteOptions);
    }

    defaultOptions.params = defaultOptions.params || {};
    if (includes && includes.length) {
      const defaultInclude = defaultOptions.params.include ? defaultOptions.params.include.split(",") : [];
      defaultOptions.params.include = defaultInclude.concat(includes).join(",");
    }
    if (remotes && remotes.length) {
      const defaultRemotes = defaultOptions.params.remotes ? defaultOptions.params.remotes.split(",") : [];
      defaultOptions.params.remotes = defaultRemotes.concat(remotes).join(",");
    }
    return defaultOptions;
  }

  /**
   * Resolve remote options for include relationships
   */
  static async resolveRemoteRequestOptionsForIncludes(remoteOptions: any, parentField: string = null) {
    const prefixKey = parentField ? `${parentField}.` : "";
    let includes = [];

    if (remoteOptions.include && remoteOptions.include.length) {
      for (const include of remoteOptions.include) {
        includes.push(`${prefixKey}${include}`);

        // Resolve subrelations
        if (remoteOptions.relations && remoteOptions.relations[include]) {
          includes = includes.concat(
            await Model.resolveRemoteRequestOptionsForIncludes(
              remoteOptions.relations[include],
              `${prefixKey}${include}`
            )
          );
        }
      }
    }
    return includes;
  }

  /**
   * Resolve remote options for remotes relationships
   */
  static async resolveRemoteRequestOptionsForRemotes(remoteOptions: any, parentField: string = null) {
    const prefixKey = parentField ? `${parentField}.` : "";
    let remotes = [];

    if (remoteOptions.remotes && remoteOptions.remotes.length) {
      for (const remote of remoteOptions.remotes) {
        remotes.push(`${prefixKey}r-${remote}`);

        // Resolve subrelations
        if (remoteOptions.relations && remoteOptions.relations[remote]) {
          remotes = remotes.concat(
            await Model.resolveRemoteRequestOptionsForRemotes(
              remoteOptions.relations[remote],
              `${prefixKey}r-${remote}`
            )
          );
        }
      }
    }
    return remotes;
  }
}
