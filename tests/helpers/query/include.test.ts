import { Op } from 'sequelize';
import { queryParse } from '../../../helpers/query';

describe('Query Parameters', () => {
  //
  // tests
  //
  describe('parse', () => {

    describe('include', () => {

      it('should return object with "include" property', done => {
        const qs = {
          include: 'user,user.status,user.r-person,user.r-person.emails'
        };

        const expected = [{
          association: 'user',
          include: [{ association: 'status' }],
          remotes: ['person'],
          relations: {
            person: {
              include: ['emails']
            }
          }
        }];

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.include).toBeDefined();
        expect(Array.isArray(result.include)).toBeTruthy();
        expect(result.include.length).toBeDefined();
        expect(typeof result.include.length === 'number').toBeTruthy();
        expect(result.include.length).toEqual(1);
        expect(typeof result.include[0] === 'object').toBeTruthy();
        expect(result.include[0].association).toBeDefined();
        expect(result.include[0].association).toEqual('user');
        expect(result.include[0].include).toBeDefined();
        expect(result.include[0].include[0]).toBeDefined();
        expect(result.include[0].include[0].association).toBeDefined();
        expect(result.include[0].include[0].association).toEqual('status');
        expect(result.include[0].remotes).toBeDefined();
        expect(result.include[0].remotes[0]).toBeDefined();
        expect(result.include[0].remotes[0]).toEqual('person');
        expect(result.include[0].relations).toBeDefined();
        expect(result.include).toEqual(expected);
        done();
      });

      it('should return object with "include" property when use reduced syntax', done => {
        const qs = {
          include: 'user.status,user.r-person.emails'
        };

        const expected = [{
          association: 'user',
          include: [{ association: 'status' }],
          remotes: ['person'],
          relations: {
            person: {
              include: ['emails']
            }
          }
        }];

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.include).toBeDefined();
        expect(Array.isArray(result.include)).toBeTruthy();
        expect(result.include.length).toBeDefined();
        expect(typeof result.include.length === 'number').toBeTruthy();
        expect(result.include.length).toEqual(1);
        expect(typeof result.include[0] === 'object').toBeTruthy();
        expect(result.include[0].association).toBeDefined();
        expect(result.include[0].association).toEqual('user');
        expect(result.include[0].include).toBeDefined();
        expect(result.include[0].include[0]).toBeDefined();
        expect(result.include[0].include[0].association).toBeDefined();
        expect(result.include[0].include[0].association).toEqual('status');
        expect(result.include[0].remotes).toBeDefined();
        expect(result.include[0].remotes[0]).toBeDefined();
        expect(result.include[0].remotes[0]).toEqual('person');
        expect(result.include[0].relations).toBeDefined();
        expect(result.include).toEqual(expected);
        done();
      });

      it('should return object with "include" and sub include property', done => {
        const qs = {
          include: 'country,country.departments'
        };

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.include).toBeDefined();
        expect(Array.isArray(result.include)).toBeTruthy();
        expect(result.include.length).toBeDefined();
        expect(typeof result.include.length === 'number').toBeTruthy();
        expect(result.include.length).toEqual(1);

        const firstLevelInclude = result.include[0];

        expect(typeof firstLevelInclude === 'object').toBeTruthy();
        expect(firstLevelInclude.association).toBeDefined();
        expect(typeof firstLevelInclude.association == 'string').toBeDefined();
        expect(firstLevelInclude.association).toEqual('country');
        expect(firstLevelInclude.include).toBeDefined();
        expect(firstLevelInclude.include.length).toBeDefined();
        expect(typeof firstLevelInclude.include.length === 'number').toBeTruthy();
        expect(firstLevelInclude.include.length).toEqual(1);

        const secondLevelInclude = firstLevelInclude.include[0];

        expect(typeof secondLevelInclude === 'object').toBeTruthy();
        expect(secondLevelInclude.association).toEqual('departments');
        done();
      });

      it('should return object with "include" and sub include property when simplify include value', done => {
        const qs = {
          include: 'country.departments'
        };

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.include).toBeDefined();
        expect(Array.isArray(result.include)).toBeTruthy();
        expect(result.include.length).toBeDefined();
        expect(typeof result.include.length === 'number').toBeTruthy();
        expect(result.include.length).toEqual(1);

        const firstLevelInclude = result.include[0];

        expect(typeof firstLevelInclude === 'object').toBeTruthy();
        expect(firstLevelInclude.association).toBeDefined();
        expect(typeof firstLevelInclude.association == 'string').toBeDefined();
        expect(firstLevelInclude.association).toEqual('country');
        expect(firstLevelInclude.include).toBeDefined();
        expect(firstLevelInclude.include.length).toBeDefined();
        expect(typeof firstLevelInclude.include.length === 'number').toBeTruthy();
        expect(firstLevelInclude.include.length).toEqual(1);

        const secondLevelInclude = firstLevelInclude.include[0];

        expect(typeof secondLevelInclude === 'object').toBeTruthy();
        expect(secondLevelInclude.association).toEqual('departments');
        done();
      });

      it('should return undefined when query string does not have "include"', done => {
        const qs = {};

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(result.include).not.toBeDefined();
        done();
      });

    });

  });

});
