import { Logger } from "@tsed/logger";
import { resolveEnvVarByApp } from "./resolvers";

const name = resolveEnvVarByApp("LOGGER_NAME", resolveEnvVarByApp("APP_NAME", "app"));
const level = resolveEnvVarByApp("LOGGER_LEVEL", "debug");

export const logger = new Logger(name);

logger.appenders.set("console-log", {
  type: "console",
  level,
});
