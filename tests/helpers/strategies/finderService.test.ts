import { Op } from 'sequelize';
import { Test } from '@nestjs/testing';
import { FinderServiceStrategy } from '../../../helpers/strategies';

describe('FinderServiceStrategy', () => {
    //
    // variables
    //
    let strategy: FinderServiceStrategy;
    let model: any;

    //
    // hooks
    //
    beforeEach(async () => {
        // Create new strategy
        strategy = new FinderServiceStrategy();

        // Create default and abstract sequelize model
        model = {
            findAll: jest.fn().mockImplementation(() => Promise.resolve([]))
        };
    });

    //
    // tests
    //
    describe('definition', () => {

        it('Strategy - should be defined', () => {
            expect(strategy).toBeDefined();
        });

    });

    // -----------------------------------------------------------------------------

    describe('find', () => {

        it('should return an objects when invoke findAll method from model with empty parameters', async () => {
            const options = {
                query: {}
            };
            const expected = {};

            expect(await strategy.find(model, options)).toEqual([]);
            expect(model.findAll).toHaveBeenCalled();
            expect(model.findAll).toHaveBeenCalledWith(expected);
        });

        // -------------------------------------------------------------------------

        it('should return an objects when invoke findAll method from model with pagination parameters', async () => {
            const options = {
                query: {
                    page: 1,
                    pageSize: 10
                }
            };
            const expected = {
                limit: 10,
                offset: 0
            };

            expect(await strategy.find(model, options)).toEqual([]);
            expect(model.findAll).toHaveBeenCalled();
            expect(model.findAll).toHaveBeenCalledWith(expected);
        });

        // -------------------------------------------------------------------------

        it('should return an objects when invoke findAll method from model with group parameter', async () => {
            const options = {
                query: {
                    group: 'id'
                }
            };
            const expected = {
                group: ['id']
            };

            expect(await strategy.find(model, options)).toEqual([]);
            expect(model.findAll).toHaveBeenCalled();
            expect(model.findAll).toHaveBeenCalledWith(expected);
        });

        // -------------------------------------------------------------------------

        it('should return an objects when invoke findAll method from model with order parameter', async () => {
            const options = {
                query: {
                    order: 'id-DESC'
                }
            };
            const expected = {
                order: [['id', 'DESC']]
            };

            expect(await strategy.find(model, options)).toEqual([]);
            expect(model.findAll).toHaveBeenCalled();
            expect(model.findAll).toHaveBeenCalledWith(expected);
        });

        // -------------------------------------------------------------------------

        it('should return an objects when invoke findAll method from model with fields parameter', async () => {
            const options = {
                query: {
                    fields: 'id,name'
                }
            };
            const expected = {
                attributes: ['id', 'name']
            };

            expect(await strategy.find(model, options)).toEqual([]);
            expect(model.findAll).toHaveBeenCalled();
            expect(model.findAll).toHaveBeenCalledWith(expected);
        });

        // -------------------------------------------------------------------------

        it('should return an objects when invoke findAll method from model with include parameter', async () => {
            const options = {
                query: {
                    include: 'status,membership,membership.membership,membership.membership.status'
                }
            };
            const expected = {
                include: [{
                    association: 'status'
                }, {
                    association: 'membership',
                    include: [{
                        association: 'membership',
                        include: [{
                            association: 'status'
                        }]
                    }],
                    relations: {
                        membership: {
                            include: ['status']
                        }
                    }
                }],
                relations: {
                    membership: {
                        include: ['membership'],
                        relations: {
                            membership: {
                                include: ['status']
                            }
                        }
                    }
                }
            };

            expect(await strategy.find(model, options)).toEqual([]);
            expect(model.findAll).toHaveBeenCalled();
            expect(model.findAll).toHaveBeenCalledWith(expected);
        });

        // -------------------------------------------------------------------------

        it('should return an objects when invoke findAll method from model with where parameter', async () => {
            const options = {
                query: {
                    filters: 'statusId eq 1,membership.membership.status.id eq 2'
                }
            };
            const expected = {
                where: {
                    statusId: {
                        [Op.eq]: 1
                    }
                },
                required: true,
                include: [{
                    association: 'membership',
                    include: [{
                        association: 'membership',
                        include: [{
                            association: 'status',
                            where: {
                                id: {
                                    [Op.eq]: 2
                                }
                            },
                            required: true
                        }]
                    }]
                }]
            };

            expect(await strategy.find(model, options)).toEqual([]);
            expect(model.findAll).toHaveBeenCalled();
            expect(model.findAll).toHaveBeenCalledWith(expected);
        });

    });
});
