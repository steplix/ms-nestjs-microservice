import { readFileSync } from "fs";
import { decode, sign, verify } from "jsonwebtoken";
import { HttpException, HttpStatus } from "@nestjs/common";

//
// constants
//

// BEGIN - Future usage
// const issuer = process.env.JWT_ISSUER || 'STEPLIX';
// const audience = process.env.JWT_AUDIENCE || 'Steplix';
// END - Future usage

const algorithm = process.env.JWT_ALGORITHM || "RS256";
const algorithms = [algorithm];
const secret = process.env.JWT_SECRET || "SECRET";
const publicKeyFile = process.env.JWT_PUBLIC_KEY_FILE ? readFileSync(process.env.JWT_PUBLIC_KEY_FILE) : null;
const privateKeyFile = process.env.JWT_PRIVATE_KEY_FILE ? readFileSync(process.env.JWT_PRIVATE_KEY_FILE) : null;
const secretOrPublicKey = process.env.JWT_PUBLIC_KEY || publicKeyFile || secret;
const secretOrPrivateKey = process.env.JWT_PRIVATE_KEY || privateKeyFile || secret;

//
// main class
//
class JWT {
  /**
   * Generate JWT
   */
  sign(payload: any, options: any = {}) {
    options = options || {};
    options.algorithm = algorithm;
    // options.algorithms = algorithms;
    // options.issuer = issuer;

    try {
      return sign(payload, secretOrPrivateKey, options);
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get the payload of the jwt without verifying if the signature is valid.
   */
  decode(token: string, options: any = {}) {
    return decode(token, options);
  }

  /**
   * The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid.
   * If not, it will be called with the error.
   */
  verify(token: string, options: any = {}) {
    options = options || {};
    options.ignoreExpiration = false;
    options.algorithms = algorithms;
    options.algorithm = algorithm;
    // options.issuer = issuer;
    // options.audience = audience;

    try {
      return verify(token, secretOrPublicKey, options);
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}

export const jwt = new JWT();
