import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class FinderDto {
    @ApiProperty({
        description: 'Filters condition',
        example: 'categoryId eq 1,description li *cerveza*',
        required: false,
        default: null,
    })
    @IsOptional()
        filters?: string;

    @ApiProperty({
        description: 'Order registers',
        example: 'createdOnUtc-DESC',
        required: false,
        default: null,
    })
    @IsOptional()
        order?: string;

    @ApiProperty({
        description: 'Group registers',
        example: 'id',
        required: false,
        default: null,
    })
    @IsOptional()
        group?: string;

    @ApiProperty({
        description: 'Fields',
        example: '*',
        required: false,
        default: null,
    })
    @IsOptional()
        fields?: string;

    @ApiProperty({
        description: 'Include relationships (Format, relation)',
        example: 'status',
        required: false,
        default: null,
    })
    @IsOptional()
        include?: string;

    @ApiProperty({
        description: 'Remote relationships (Format, relation)',
        example: 'product',
        required: false,
        default: null,
    })
    @IsOptional()
        remotes?: string;

    @ApiProperty({
        description: 'Indicate page size length',
        example: '10',
        required: false,
        default: 25,
    })
    @IsOptional()
    @IsNumberString({}, { message: 'Invalid page size' })
        pageSize?: string;

    @ApiProperty({
        description: 'Indicate current page',
        example: '1',
        required: false,
        default: 1,
    })
    @IsOptional()
    @IsNumberString({}, { message: 'Invalid page' })
        page?: string;
}
