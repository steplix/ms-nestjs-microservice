import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryDto {
    @ApiProperty({
        description: 'Filters condition',
        example: 'categoryId = 1 & description like "%beer%"',
        required: false,
        default: null
    })
    @IsOptional()
        filters?: string;

    @ApiProperty({
        description: 'Order registers',
        example: 'createdOnUtc-DESC',
        required: false,
        default: null
    })
    @IsOptional()
        order?: string;

    @ApiProperty({
        description: 'Group registers',
        example: 'id',
        required: false,
        default: null
    })
    @IsOptional()
        group?: string;

    @ApiProperty({
        description: 'Fields',
        example: 'id, description',
        required: false,
        default: null
    })
    @IsOptional()
        fields?: string;

    @ApiProperty({
        description: 'Include relationships (Format, relation)',
        example: 'status, department',
        required: false,
        default: null
    })
    @IsOptional()
        includes?: string;

    @ApiProperty({
        description: 'Indicate page size length',
        example: 10,
        required: false,
        default: 25
    })
    @IsOptional()
    @IsNumber(undefined, { message: 'Invalid page size' })
        pageSize?: number;

    @ApiProperty({
        description: 'Indicate current page',
        example: 1,
        required: false,
        default: 1
    })
    @IsOptional()
    @IsNumber(undefined, { message: 'Invalid page' })
        page?: number;
}
