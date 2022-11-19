import { Op } from 'sequelize';
import { queryParse } from '../../../helpers/query';

describe('Query Parameters', () => {
  //
  // tests
  //
  describe('parse', () => {

    describe('filters', () => {

      it('should return object with active and description', done => {
        const qs = {
          filters: 'active eq 1'
        };

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.where).toBeDefined();
        expect(typeof result.where === 'object').toBeTruthy();
        expect(result.where.active).toBeDefined();
        expect(typeof result.where.active === 'object').toBeTruthy();
        expect(result.where.active[Op.eq]).toBeDefined();
        expect(result.where.active[Op.eq]).toEqual(1);
        done();
      });

      it('should return object with active and description with correct operators', done => {
        const qs = {
          filters: 'active eq 1,description li *casa'
        };

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.where).toBeDefined();
        expect(typeof result.where === 'object').toBeTruthy();
        expect(result.where.active).toBeDefined();
        expect(typeof result.where.active === 'object').toBeTruthy();
        expect(result.where.active[Op.eq]).toBeDefined();
        expect(result.where.active[Op.eq]).toEqual(1);
        expect(result.where.active).toBeDefined();
        expect(typeof result.where.description === 'object').toBeTruthy();
        expect(result.where.description[Op.like]).toBeDefined();
        expect(result.where.description[Op.like]).toEqual('%casa');
        done();
      });

      it('should return undefined when query string does not have filters', done => {
        const qs = {};

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(result.where).not.toBeDefined();
        done();
      });

    });

  });

});
