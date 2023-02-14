import { type QueryDto } from '../../dto';
import { type FindOptions } from 'sequelize';
import { parsePagination } from './pagination';
import { parseFields } from './fields';
import { parseFilters } from './filters';
import { parseGroup } from './group';
import { parseIncludes } from './includes';
import { parseOrder } from './order';

export const queryParser = async (query: QueryDto): Promise<FindOptions> => {
    const pagination = parsePagination(query);

    return {
        where: await parseFilters(query),
        attributes: parseFields(query),
        include: parseIncludes(query),
        order: parseOrder(query),
        group: parseGroup(query),
        limit: pagination.limit,
        offset: pagination.offset
    };
};
