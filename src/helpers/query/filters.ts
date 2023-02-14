import { Expression } from 'sequelize-expression';
import { Op, type WhereOptions } from 'sequelize';
import { type QueryDto } from 'dto';

export const parseFilters = async (query: QueryDto): Promise<WhereOptions | undefined> => {
    if (query.filters === undefined || query.filters === '') return;

    const parser = new Expression({ op: { ...Op } });
    const where = await parser.parse(query.filters);
    if (!where.ok) return;
    if (where.result === undefined) return;

    return { ...where.getResult() };
};
