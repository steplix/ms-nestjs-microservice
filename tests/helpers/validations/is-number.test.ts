import { isNumber } from '../../../src/helpers/validations';

describe('validations', () => {

  describe('isNumber', () => {

    it('should validate number', done => {
      expect(isNumber('a')).toBeFalsy();
      expect(isNumber('6')).toBeTruthy();
      expect(isNumber('6.1')).toBeTruthy();
      expect(isNumber('-6')).toBeTruthy();
      done();
    });

  });

});
