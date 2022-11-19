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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseOptionsService = exports.isDatabaseEnabled = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
/**
 * Indicate if Database feature is enabled
 */
exports.isDatabaseEnabled = !constants_1.falses.includes(String(process.env.DB_ENABLED).toLowerCase());
/**
 * Indicate if Database debug queries is enabled
 */
const isDatabaseDebug = constants_1.trues.includes(String(process.env.DB_DEBUG).toLowerCase());
/**
 * Indicate if autodiscover models
 */
const isAutodiscover = constants_1.trues.includes(String(process.env.DB_AUTODISCOVER).toLowerCase());
/**
 * Indicate if Database Pool is enabled
 */
const isPoolEnabled = constants_1.trues.includes(String(process.env.DB_POOL_ENABLED).toLowerCase());
/**
 * Database default options
 */
let DatabaseOptionsService = class DatabaseOptionsService {
    createSequelizeOptions() {
        const defaultHost = this.config.get("DB_HOST", this.config.get("DATABASE_MYSQL_HOST", "localhost"));
        const defaultPort = this.config.get("DB_PORT", this.config.get("DATABASE_MYSQL_PORT", 3306));
        const defaultUser = this.config.get("DB_USER", this.config.get("DATABASE_MYSQL_USER", "root"));
        const defaultName = this.config.get("DB_NAME", this.config.get("DATABASE_MYSQL_NAME", "steplix"));
        const defaultPass = this.config.get("DB_PASS", this.config.get("DATABASE_MYSQL_PASSWORD", "secret"));
        const defaultTimezone = this.config.get("DB_TIMEZONE", this.config.get("DATABASE_MYSQL_TIMEZONE", "+00:00"));
        const models = [];
        let pool;
        if (isPoolEnabled) {
            // Maximum number of connection in pool
            const poolMax = this.config.get("DB_POOL_MAX_CONN", 10);
            // Minimum number of connection in pool
            const poolMin = this.config.get("DB_POOL_MIN_CONN", 0);
            // The maximum time, in milliseconds, that a connection can be idle before being released
            const poolIdle = this.config.get("DB_POOL_IDLE", 10000);
            // The maximum time, in milliseconds, that pool will try to get connection before throwing error
            const poolAcquire = this.config.get("DB_POOL_ACQUIRE", 60000);
            // The time interval, in milliseconds, after which sequelize-pool will remove idle connections.
            const poolEvict = this.config.get("DB_POOL_EVICT", 1000);
            pool = {
                max: poolMax,
                min: poolMin,
                idle: poolIdle,
                acquire: poolAcquire,
                evict: poolEvict,
            };
        }
        if (isAutodiscover) {
            models.push(this.config.get("DB_ENTITIES_DIR", `${process.cwd()}/!(node_modules)/entities/!(index).js`));
        }
        return {
            database: defaultName,
            dialect: "mysql",
            // eslint-disable-next-line no-console
            logging: isDatabaseDebug ? console.log : false,
            timezone: defaultTimezone,
            autoLoadModels: true,
            models,
            replication: {
                read: [
                    {
                        host: this.config.get("DB_READ_HOST", defaultHost),
                        port: this.config.get("DB_READ_PORT", defaultPort),
                        username: this.config.get("DB_READ_USER", defaultUser),
                        password: this.config.get("DB_READ_PASS", defaultPass),
                    },
                ],
                write: {
                    host: this.config.get("DB_WRITE_HOST", defaultHost),
                    port: this.config.get("DB_WRITE_PORT", defaultPort),
                    username: this.config.get("DB_WRITE_USER", defaultUser),
                    password: this.config.get("DB_WRITE_PASS", defaultPass),
                },
            },
            define: {
                timestamps: false,
            },
            dialectOptions: {
                decimalNumbers: true,
            },
            pool,
        };
    }
};
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], DatabaseOptionsService.prototype, "config", void 0);
DatabaseOptionsService = __decorate([
    (0, common_1.Injectable)()
], DatabaseOptionsService);
exports.DatabaseOptionsService = DatabaseOptionsService;
