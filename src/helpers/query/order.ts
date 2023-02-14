import { type QueryDto } from '../../dto';
import { OrderDirectionEnum } from '../../enums';
import { type Order } from 'sequelize';

export const parseOrder = (query: QueryDto): Order | undefined => {
    if (query.order === undefined) return;

    const orders = query.order.split(',').map(order => order.trim());
    return orders.map(order => {
        const [field, dir] = order.split('-');
        return [field, dir.toUpperCase() ?? OrderDirectionEnum.ASC];
    });
};
