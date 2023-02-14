import { type QueryDto } from 'dto';
import { fn, col, type FindAttributeOptions, type ProjectionAlias } from 'sequelize';

const buildField = (field: string): string | ProjectionAlias => {
    if (!field.includes('-')) return field;

    const [func, column, columnName] = field.split('-');
    return [fn(func, col(column)), columnName];
};

export const parseFields = (query: QueryDto): FindAttributeOptions | undefined => {
    if (query.fields === undefined) return;
    const fields = query.fields.split(',').map(field => field.trim());

    return fields.map(buildField);
};
