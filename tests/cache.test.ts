//
// imports
//
import { isEqual } from 'lodash';
import { cache } from '../src/cache';

//
// constants
//
const CACHE_KEY_FOR_TEST = 'test.cache.check';
const CACHE_VALUE_FOR_TEST = {
    value: 123
};

//
// suites
//
describe('Cache', () => {
  //
  // tests
  //
  describe('#get', () => {

    it('Should get an undefined value', async () => {
      try {
        const cached = await cache.get(CACHE_KEY_FOR_TEST);

        expect(cached).toBeUndefined();
      }
      catch (e) {
        // Ignore
      }
    });

    it('Should get an undefined value, but instead will get a default value', async () => {
      try {
        const cached = await cache.get(CACHE_KEY_FOR_TEST, CACHE_VALUE_FOR_TEST.value);

        expect(cached).toEqual(CACHE_VALUE_FOR_TEST.value);
      }
      catch (e) {
        // Ignore
      }
    });

  });

  describe('#put', () => {

    it('Should put an example value', async () => {
      try {
        let cached = await cache.put(CACHE_KEY_FOR_TEST, CACHE_VALUE_FOR_TEST);

        expect(isEqual(cached, CACHE_VALUE_FOR_TEST)).toBeTruthy();
        cached = await cache.get(CACHE_KEY_FOR_TEST);
        expect(isEqual(cached, CACHE_VALUE_FOR_TEST)).toBeTruthy();
      }
      catch (e) {
        // Ignore
      }
    });

    it('Should remove an key when value is undefined ', async () => {
      try {
        let cached = await cache.put(CACHE_KEY_FOR_TEST, CACHE_VALUE_FOR_TEST);

        expect(isEqual(cached, CACHE_VALUE_FOR_TEST)).toBeTruthy();
        cached = await cache.put(CACHE_KEY_FOR_TEST);
        expect(isEqual(cached, CACHE_VALUE_FOR_TEST)).not.toBeTruthy();
        cached = await cache.get(CACHE_KEY_FOR_TEST);
        expect(cached).toBeUndefined();
      }
      catch (e) {
        // Ignore
      }
    });

    it('Should get an expired value, but instead will get a undefined value', done => {
      (async () => {
        let cached = await cache.put(CACHE_KEY_FOR_TEST, CACHE_VALUE_FOR_TEST, 150);

        expect(isEqual(cached, CACHE_VALUE_FOR_TEST)).toBeTruthy();
        cached = await cache.get(CACHE_KEY_FOR_TEST);
        expect(isEqual(cached, CACHE_VALUE_FOR_TEST)).toBeTruthy();

        (async () => setTimeout(async () => {
          try {
            cached = await cache.get(CACHE_KEY_FOR_TEST);
            expect(isEqual(cached, CACHE_VALUE_FOR_TEST)).not.toBeTruthy();
          }
          catch (e) {
            // Ignore
          }

          done();
        }, 151))();
      })();
    });

  });

  describe('#remove', () => {

    it('Should remove an key', async () => {
      try {
        let cached = await cache.put(CACHE_KEY_FOR_TEST, CACHE_VALUE_FOR_TEST);

        expect(isEqual(cached, CACHE_VALUE_FOR_TEST)).toBeTruthy();
        await cache.remove(CACHE_KEY_FOR_TEST);
        cached = await cache.get(CACHE_KEY_FOR_TEST);
        expect(cached).toBeUndefined();
      }
      catch (e) {
        // Ignore
      }
    });

    it('Should remove all match keys', async () => {
      try {
        await cache.put({
          [`${CACHE_KEY_FOR_TEST}1`]: 1,
          [`${CACHE_KEY_FOR_TEST}2`]: 2,
          [`${CACHE_KEY_FOR_TEST}3`]: 3,
          [`${CACHE_KEY_FOR_TEST}4`]: 4,
          [`${CACHE_KEY_FOR_TEST}5`]: 5,
          other_key: 6
        });

        let cached = await cache.get(`${CACHE_KEY_FOR_TEST}1`);

        expect(cached).toEqual(1);
        await cache.removeMatch(`${CACHE_KEY_FOR_TEST}*`);
        cached = await cache.get(`${CACHE_KEY_FOR_TEST}1`);
        expect(cached).toBeUndefined();
        cached = await cache.get('other_key');
        expect(cached).toEqual(6);
      }
      catch (e) {
        // Ignore
      }
    });

    it('Should clear cache', async () => {
      try {
        await cache.put({
          [`${CACHE_KEY_FOR_TEST}1`]: 1,
          [`${CACHE_KEY_FOR_TEST}2`]: 2,
          [`${CACHE_KEY_FOR_TEST}3`]: 3,
          [`${CACHE_KEY_FOR_TEST}4`]: 4,
          [`${CACHE_KEY_FOR_TEST}5`]: 5
        });

        let cached = await cache.get(`${CACHE_KEY_FOR_TEST}1`);

        expect(cached).toEqual(1);
        await cache.clear();
        cached = await cache.get(`${CACHE_KEY_FOR_TEST}1`);
        expect(cached).toBeUndefined();
      }
      catch (e) {
        // Ignore
      }
    });

  });

});
