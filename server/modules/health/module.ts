import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ServiceHealthIndicator } from "../../../services";
import { HealthController } from "./controller";
import { HealthService } from "./service";

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthService, ServiceHealthIndicator],
  exports: [HealthService],
})
export class HealthModule {}
