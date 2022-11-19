import { Op } from 'sequelize';
import { Test } from '@nestjs/testing';
import { GetterByIdServiceStrategy } from '../../../helpers/strategies';

const modelMock = {
    id: 1,
    name: 'Mock'
};

describe('GetterByIdServiceStrategy', () => {
    //
    // variables
    //
    let strategy: GetterByIdServiceStrategy;
    let model: any;

    //
    // hooks
    //
    beforeEach(async () => {
        // Create new strategy
        strategy = new GetterByIdServiceStrategy();

        // Create default and abstract sequelize model
        model = {
            findOne: jest.fn().mockImplementation(() => Promise.resolve(modelMock))
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

        it('should return an objects when invoke findOne method from model with where parameters', async () => {
            const options = {
                query: {}
            };
            const expected = {
                where: {
                    id: 1
                }
            };

            expect(await strategy.getById(1, model, options)).toEqual(modelMock);
            expect(model.findOne).toHaveBeenCalled();
            expect(model.findOne).toHaveBeenCalledWith(expected);
        });

        // -------------------------------------------------------------------------

        it('should return an objects when invoke findOne method from model with fields parameter', async () => {
            const options = {
                query: {
                    fields: 'id,name'
                }
            };
            const expected = {
                where: {
                    id: 1
                },
                attributes: ['id', 'name']
            };

            expect(await strategy.getById(1, model, options)).toEqual(modelMock);
            expect(model.findOne).toHaveBeenCalled();
            expect(model.findOne).toHaveBeenCalledWith(expected);
        });

        // -------------------------------------------------------------------------

        it('should return an objects when invoke findOne method from model with include parameter', async () => {
            const options = {
                query: {
                    include: 'status,membership,membership.membership,membership.membership.status'
                }
            };
            const expected = {
                where: {
                    id: 1
                },
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

            expect(await strategy.getById(1, model, options)).toEqual(modelMock);
            expect(model.findOne).toHaveBeenCalled();
            expect(model.findOne).toHaveBeenCalledWith(expected);
        });

    });
});
