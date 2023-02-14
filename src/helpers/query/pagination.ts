import { type QueryDto } from 'dto';

const MINIMUM_PAGE_SIZE = 1;
const MINIMUM_PAGE = 1;

export const parsePagination = (query: QueryDto): { limit?: number, offset?: number } => {
    if (query.pageSize === undefined) return {};

    query.page = query.page ?? MINIMUM_PAGE;
    query.pageSize = query.pageSize ?? MINIMUM_PAGE_SIZE;

    const pageSize = query.pageSize >= MINIMUM_PAGE_SIZE ? query.pageSize : MINIMUM_PAGE_SIZE;
    const page = query.page >= MINIMUM_PAGE ? query.page : MINIMUM_PAGE;

    return {
        limit: query.pageSize,
        offset: (page - 1) * pageSize
    };
};
