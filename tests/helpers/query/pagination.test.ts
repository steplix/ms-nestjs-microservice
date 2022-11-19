import { queryParse } from '../../../helpers/query';

describe('Query Parameters', () => {
  //
  // tests
  //
  describe('parse', () => {

    describe('pagination', () => {

      it('should return object with limit and offset', done => {
        const qs = {
          pageSize: 10,
          page: 1
        };

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.offset).toBeDefined();
        expect(result.limit).toBeDefined();
        expect(result.offset).toEqual(qs.pageSize * (qs.page - 1));
        expect(result.limit).toEqual(qs.pageSize);
        done();
      });

      it('should return object with correct offset', done => {
        const qs = {
          pageSize: 10,
          page: 2
        };

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.offset).toBeDefined();
        expect(result.limit).toBeDefined();
        expect(result.offset).toEqual(qs.pageSize * (qs.page - 1));
        expect(result.limit).toEqual(qs.pageSize);
        done();
      });

      it('should return default values when query string does not have pageSize and page', done => {
        const qs = {};
        const opts = {
          pageSize: 25
        };

        const result = queryParse(qs, opts);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.offset).toBeDefined();
        expect(result.limit).toBeDefined();
        expect(result.offset).toEqual(0);
        expect(result.limit).toEqual(opts.pageSize);
        done();
      });

      it('should return undefined when query string does not have pageSize and page', done => {
        const qs = {};

        const result = queryParse(qs);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.offset).not.toBeDefined();
        expect(result.limit).not.toBeDefined();
        done();
      });

    });

  });

});
