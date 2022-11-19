import { SequelizeModule } from "@nestjs/sequelize";
import { DatabaseOptionsService } from "./options";

/**
 * Database module
 */
export const DatabaseModule = () => SequelizeModule.forRootAsync({ useClass: DatabaseOptionsService });
