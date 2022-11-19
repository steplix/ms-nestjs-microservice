import { ApiProperty } from "@nestjs/swagger";

export class HealthEntity {
  @ApiProperty({
    type: Boolean,
    description: "Indicate if micro service is alive.",
  })
  alive: boolean;

  @ApiProperty({ type: String, description: "Micro service name." })
  name: string;

  @ApiProperty({ type: String, description: "Micro service version." })
  version: string;

  @ApiProperty({
    type: String,
    description: "Environment where it is running.",
  })
  environment: string;

  @ApiProperty({ type: String, description: "Indicate micro service status" })
  status?: string;

  @ApiProperty({ type: Object, description: "Includes information" })
  info?: any;

  @ApiProperty({
    type: Object,
    description: "Includes more details information",
  })
  details?: any;

  @ApiProperty({ type: Object, description: "Error information" })
  error?: any;
}
