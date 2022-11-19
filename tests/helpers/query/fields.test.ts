import { queryParse } from '../../../helpers/query';

describe('Query Parameters', () => {
  //
  // tests
  //
  describe('parse', () => {

    describe('fields', () => {

      it('should return object with attributes', done => {
        const qs = {
          fields: 'id,statusId'
        };

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.attributes).toBeDefined();
        expect(Array.isArray(result.attributes)).toBeTruthy();
        expect(result.attributes.length).toBeDefined();
        expect(typeof result.attributes.length === 'number').toBeTruthy();
        expect(result.attributes.length).toEqual(2);
        expect(result.attributes[0]).toBeDefined();
        expect(typeof result.attributes[0] === 'string').toBeTruthy();
        expect(result.attributes[0]).toEqual('id');
        expect(result.attributes[1]).toBeDefined();
        expect(typeof result.attributes[1] === 'string').toBeTruthy();
        expect(result.attributes[1]).toEqual('statusId');
        done();
      });

      it('should return undefined when query string does not have fields', done => {
        const qs = {};

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(result.attributes).not.toBeDefined();
        done();
      });

    });

  });

});
