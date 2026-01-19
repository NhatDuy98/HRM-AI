import { Controller, Get } from "@nestjs/common";
import { HealthCheckService } from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  public constructor(private readonly health: HealthCheckService) {}

  @Get()
  public async healthCheck() {
    return this.health.check([
      () => ({
        http: {
          status: "up",
          uptime: process.uptime(),
        },
      }),
    ]);
  }
}
