import { queryParse } from '../../../helpers/query';

describe('Query Parameters', () => {
  //
  // tests
  //
  describe('parse', () => {

    describe('group', () => {

      it('should return array with id_token', done => {
        const qs = {
          group: 'id_token'
        };

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.group).toBeDefined();
        expect(Array.isArray(result.group)).toBeTruthy();
        expect(result.group.length).toBeDefined();
        expect(typeof result.group.length === 'number').toBeTruthy();
        expect(result.group.length).toEqual(1);
        expect(result.group[0]).toEqual('id_token');
        done();
      });

      it('should return undefined when query string does not have order', done => {
        const qs = {};

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(result.group).not.toBeDefined();
        done();
      });

    });

  });

});
