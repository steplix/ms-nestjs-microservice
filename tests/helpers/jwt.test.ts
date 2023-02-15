//
// define constants
//
// process.env.JWT_PUBLIC_KEY_FILE = `${process.cwd()}_auth/.keys/oauth-public.key`;
// process.env.JWT_PRIVATE_KEY_FILE = `${process.cwd()}_auth/.keys/oauth-private.key`;

//
// imports
//
import { jwt } from '../../src/helpers';

//
// constants
//
// Real token generated with APIv2
// const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxNSIsImp0aSI6ImM3OWJkOGI2YmUzYTQ3MGMzMzljMzlmYzA0ZjMwMDU2ZTRkZjhhN2Q4Y2M0YTFiMzEzMDdmNDljYzAxM2MxODBjZmRkMjhkM2U5ODM3OTM5IiwiaWF0IjoxNjY4MDA1NTA1LCJuYmYiOjE2NjgwMDU1MDUsImV4cCI6MzI0NTkyODcwNSwic3ViIjoiMSIsInNjb3BlcyI6W119.puUQTf35CahMzqZhxUlw7acUuvH5uiPLObEtP3I39GeiSQJ0D-FZrhR-n_hea5hoZyEgU5qfguOCi2GlZ60mO8dW-fUh_bkOziQEf0kRoGkqghfQHhd_-A3OUvP4BiI0wMqb6C_pHD3kV1sTs0oj5F-AQUUILpoEtPCxHvWRtHOV0eE6qLsSW9WjK-mOS_KU4VQMhhCZGExULvVWtLeXjJbxVRhBIEo4I3ZlRjid1S4FXD9pDQdWVUu4O55hXICFVXS3aIKbhLFyzwXFUP4lan2KPiE1wic7T-eO9vA7b2DxOQZNkkSDF8RVkyprqNlW2Awhgqf9BrwKFXQBxXJJyTlWDI1S7DQlo2Q9zGTEg5vfVbkxv_uAUN_VHqdu7QTGzhZ6GFIChy-xCyCcPrthEd95ddkJEPMEnQtmvoF96jArWU-HHhCkV6DUKymEMst5kE5o7U2-NuHSJ9nxkNhAs78uvBHOb0-3RsoV_6hi76QjVjyFKEDxKT-ZgFnQsuu9NyeVWzg6qFNOgCZzTphvTsMdoD11Hp_V9jz5d4mjh-LG3sTUGzKeR7rZwOWAESvWOWTBivK-wwgIXrJOfSAJBN2StEfBxTBL6WG9vL0ej8EuBDJFd62_ZSWArW34dI9rePjOEhPb9UCejBQRJO__nMbShB6WVpRFFv_Li1wZ2u8';
// Token generated with MS_auth
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxNSIsImp0aSI6ImM3OWJkOGI2YmUzYTQ3MGMzMzljMzlmYzA0ZjMwMDU2ZTRkZjhhN2Q4Y2M0YTFiMzEzMDdmNDljYzAxM2MxODBjZmRkMjhkM2U5ODM3OTM5IiwiaWF0IjoxNjY4MDA1NTA1LCJuYmYiOjE2NjgwMDU1MDUsImV4cCI6MzI0NTkyODcwNSwic3ViIjoiMSIsInNjb3BlcyI6W119.2a2s_veL2jd1hGQJGVHXRQW1WtiomYtCmTm25HX_fW0';

//
// suites
//
describe('JSON Web Token', () => {
  //
  // tests
  //
  describe('jwt', () => {

    describe('decode', () => {

      it('should return correct payload when decode', done => {
        const result: any = jwt.decode(token);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.sub).toBeDefined();
        expect(typeof result.sub === 'string').toBeTruthy();
        expect(result.sub).toEqual('1');
        done();
      });

    });

    describe('verify', () => {

      it('should return correct payload when verify', done => {
        const result: any = jwt.verify(token);

        expect(result).toBeDefined();
        expect(typeof result === 'object').toBeTruthy();
        expect(result.sub).toBeDefined();
        expect(typeof result.sub === 'string').toBeTruthy();
        expect(result.sub).toEqual('1');
        done();
      });

    });

    describe('sign', () => {

      it('should return correct payload when sign', done => {
        const payload: any = {
          aud: '15',
          jti: 'c79bd8b6be3a470c339c39fc04f30056e4df8a7d8cc4a1b31307f49cc013c180cfdd28d3e9837939',
          iat: 1668005505,
          nbf: 1668005505,
          exp: 3245928705,
          sub: '1',
          scopes: []
        };

        const result: any = jwt.sign(payload);

        expect(result).toBeDefined();
        expect(typeof result === 'string').toBeTruthy();
        expect(result).toEqual(token);
        done();
      });

    });

  });

});
