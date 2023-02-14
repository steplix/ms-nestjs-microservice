import { type QueryDto } from 'dto';

export const parseIncludes = (query: QueryDto): string[] | undefined => {
    if (query.includes === undefined) return;
    return query.includes.split(',').map(include => include.trim());
};
