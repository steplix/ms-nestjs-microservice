import { isInteger } from '../../../helpers/validations';

describe('validations', () => {

  describe('isInteger', () => {

    it('should validate integer', done => {
      expect(isInteger(undefined)).toBeFalsy();
      expect(isInteger(null)).toBeFalsy();
      expect(isInteger('a')).toBeFalsy();
      expect(isInteger('6')).toBeTruthy();
      expect(isInteger('6.1')).toBeFalsy();
      expect(isInteger('-6')).toBeTruthy();
      expect(isInteger(6)).toBeTruthy();
      expect(isInteger(6.1)).toBeFalsy();
      expect(isInteger(-6)).toBeTruthy();
      done();
    });

  });

});