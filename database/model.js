"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
require("reflect-metadata");
const pluralize_1 = __importDefault(require("pluralize"));
const sequelize_typescript_1 = require("sequelize-typescript");
const helpers_1 = require("../helpers");
const services_1 = require("../services");
//
// main class
//
/**
 * Abstract model
 */
class Model extends sequelize_typescript_1.Model {
    /**
     * Sequelize hook for before find function
     */
    static async afterFindHook(models, options) {
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
    static async resolveIncludes(model, findOptions) {
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
    static async resolveRemotes(model, findOptions) {
        for (const remote of findOptions.remotes) {
            const remoteOptions = Reflect.getMetadata(`remote_${remote}`, model, remote);
            if (remoteOptions) {
                await Model.resolveRemote(model, findOptions, remote, remoteOptions);
            }
        }
    }
    /**
     * Resolve remote relationship
     */
    static async resolveRemote(model, findOptions, remoteField, remoteOptions) {
        let { service, uri, method } = remoteOptions;
        const relationship = remoteOptions.remoteField || (0, pluralize_1.default)(remoteField);
        // 01. Resolve remote service, by service name.
        const serviceName = (0, helpers_1.resolvePossibleFunctionValue)(service, relationship, model, findOptions);
        service = services_1.Service.get(serviceName);
        if (!service) {
            helpers_1.logger.warn(`Remote service ${serviceName} does not exists`);
            return;
        }
        // 02. Resolve request find options
        const relations = findOptions.relations || {};
        const args = { model, options: findOptions };
        let options = remoteOptions.options;
        uri = (0, helpers_1.resolvePossibleFunctionValue)(uri, `/api/v1/${relationship}`, args);
        method = (0, helpers_1.resolvePossibleFunctionValue)(method, "get", args);
        options = (0, helpers_1.resolvePossibleFunctionValue)(options, {}, args);
        // 03. Try to call endpoint with resolved variables
        try {
            model.setDataValue(remoteField, await service[method]({
                uri,
                ...(await Model.resolveRemoteRequestOptions(relations[remoteField], options)),
            }));
        }
        catch (e) {
            const { required, silent } = remoteOptions;
            // 03. a. Check if this attribute is required
            if ((0, helpers_1.resolvePossibleFunctionValue)(required, true, args)) {
                helpers_1.logger.error(`Cant load remote value for ${remoteField} from ${method} ${uri} with data ${JSON.stringify(options)}`, e);
                throw e;
            }
            // 03. b. Check if is necesary debug warning when call fail
            if (!(0, helpers_1.resolvePossibleFunctionValue)(silent, false, args)) {
                helpers_1.logger.warn(`Cant load remote value for ${remoteField} from ${method} ${uri} with data ${JSON.stringify(options)}`);
            }
        }
    }
    /**
     * Resolve remote options for relationship
     */
    static async resolveRemoteRequestOptions(remoteOptions, defaultOptions) {
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
    static async resolveRemoteRequestOptionsForIncludes(remoteOptions, parentField = null) {
        const prefixKey = parentField ? `${parentField}.` : "";
        let includes = [];
        if (remoteOptions.include && remoteOptions.include.length) {
            for (const include of remoteOptions.include) {
                includes.push(`${prefixKey}${include}`);
                // Resolve subrelations
                if (remoteOptions.relations && remoteOptions.relations[include]) {
                    includes = includes.concat(await Model.resolveRemoteRequestOptionsForIncludes(remoteOptions.relations[include], `${prefixKey}${include}`));
                }
            }
        }
        return includes;
    }
    /**
     * Resolve remote options for remotes relationships
     */
    static async resolveRemoteRequestOptionsForRemotes(remoteOptions, parentField = null) {
        const prefixKey = parentField ? `${parentField}.` : "";
        let remotes = [];
        if (remoteOptions.remotes && remoteOptions.remotes.length) {
            for (const remote of remoteOptions.remotes) {
                remotes.push(`${prefixKey}r-${remote}`);
                // Resolve subrelations
                if (remoteOptions.relations && remoteOptions.relations[remote]) {
                    remotes = remotes.concat(await Model.resolveRemoteRequestOptionsForRemotes(remoteOptions.relations[remote], `${prefixKey}r-${remote}`));
                }
            }
        }
        return remotes;
    }
}
__decorate([
    sequelize_typescript_1.AfterFind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Model, "afterFindHook", null);
exports.Model = Model;
