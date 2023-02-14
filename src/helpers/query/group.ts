import { type QueryDto } from '../../dto';
import { type GroupOption } from 'sequelize';

export const parseGroup = (query: QueryDto): GroupOption | undefined => {
    if (query.group === undefined) return;
    return query.group.split(',').map(group => group.trim());
};
