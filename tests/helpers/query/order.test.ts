import { queryParse } from '../../../helpers/query';

describe('Query Parameters', () => {
  //
  // tests
  //
  describe('parse', () => {

    describe('order', () => {

      it('should return array with created_at DESC and id ASC', done => {
        const qs = {
          order: 'created_at-DESC,id-ASC'
        };

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.order).toBeDefined();
        expect(Array.isArray(result.order)).toBeTruthy();
        expect(result.order.length).toBeDefined();
        expect(typeof result.order.length === 'number').toBeTruthy();
        expect(result.order.length).toEqual(2);
        expect(result.order[0][0]).toEqual('created_at');
        expect(result.order[0][1]).toEqual('DESC');
        expect(result.order[1][0]).toEqual('id');
        expect(result.order[1][1]).toEqual('ASC');
        done();
      });

      it('should return undefined when query string does not have order', done => {
        const qs = {};

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(result.order).not.toBeDefined();
        done();
      });

    });

  });

});
