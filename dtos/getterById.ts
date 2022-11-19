import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GetterByIdDto {
  @ApiProperty({
    description: "Fields",
    example: "*",
    required: false,
    default: null,
  })
  @IsOptional()
  fields?: string;

  @ApiProperty({
    description: "Include relationships (Format, field[-direction[-alias]])",
    example: "picture-left-image",
    required: false,
    default: null,
  })
  @IsOptional()
  include?: string;
}
