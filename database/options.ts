import { ConfigService } from "@nestjs/config";
import { Injectable, Inject } from "@nestjs/common";
import { SequelizeOptionsFactory, SequelizeModuleOptions } from "@nestjs/sequelize";
import { trues, falses } from "../constants";

/**
 * Indicate if Database feature is enabled
 */
export const isDatabaseEnabled = !falses.includes(String(process.env.DB_ENABLED).toLowerCase());

/**
 * Indicate if Database debug queries is enabled
 */
const isDatabaseDebug = trues.includes(String(process.env.DB_DEBUG).toLowerCase());

/**
 * Indicate if autodiscover models
 */
const isAutodiscover = trues.includes(String(process.env.DB_AUTODISCOVER).toLowerCase());

/**
 * Indicate if Database Pool is enabled
 */
const isPoolEnabled = trues.includes(String(process.env.DB_POOL_ENABLED).toLowerCase());

/**
 * Database default options
 */
@Injectable()
export class DatabaseOptionsService implements SequelizeOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createSequelizeOptions(): SequelizeModuleOptions {
    const defaultHost = this.config.get<string>("DB_HOST", this.config.get<string>("DATABASE_MYSQL_HOST", "localhost"));
    const defaultPort = this.config.get<number>("DB_PORT", this.config.get<number>("DATABASE_MYSQL_PORT", 3306));
    const defaultUser = this.config.get<string>("DB_USER", this.config.get<string>("DATABASE_MYSQL_USER", "root"));
    const defaultName = this.config.get<string>("DB_NAME", this.config.get<string>("DATABASE_MYSQL_NAME", "steplix"));
    const defaultPass = this.config.get<string>(
      "DB_PASS",
      this.config.get<string>("DATABASE_MYSQL_PASSWORD", "secret")
    );
    const defaultTimezone = this.config.get<string>(
      "DB_TIMEZONE",
      this.config.get<string>("DATABASE_MYSQL_TIMEZONE", "+00:00")
    );
    const models = [];
    let pool;

    if (isPoolEnabled) {
      // Maximum number of connection in pool
      const poolMax = this.config.get<number>("DB_POOL_MAX_CONN", 10);
      // Minimum number of connection in pool
      const poolMin = this.config.get<number>("DB_POOL_MIN_CONN", 0);
      // The maximum time, in milliseconds, that a connection can be idle before being released
      const poolIdle = this.config.get<number>("DB_POOL_IDLE", 10000);
      // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      const poolAcquire = this.config.get<number>("DB_POOL_ACQUIRE", 60000);
      // The time interval, in milliseconds, after which sequelize-pool will remove idle connections.
      const poolEvict = this.config.get<number>("DB_POOL_EVICT", 1000);

      pool = {
        max: poolMax,
        min: poolMin,
        idle: poolIdle,
        acquire: poolAcquire,
        evict: poolEvict,
      };
    }

    if (isAutodiscover) {
      models.push(this.config.get<string>("DB_ENTITIES_DIR", `${process.cwd()}/!(node_modules)/entities/!(index).js`));
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
            host: this.config.get<string>("DB_READ_HOST", defaultHost),
            port: this.config.get<number>("DB_READ_PORT", defaultPort),
            username: this.config.get<string>("DB_READ_USER", defaultUser),
            password: this.config.get<string>("DB_READ_PASS", defaultPass),
          },
        ],
        write: {
          host: this.config.get<string>("DB_WRITE_HOST", defaultHost),
          port: this.config.get<number>("DB_WRITE_PORT", defaultPort),
          username: this.config.get<string>("DB_WRITE_USER", defaultUser),
          password: this.config.get<string>("DB_WRITE_PASS", defaultPass),
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
}
