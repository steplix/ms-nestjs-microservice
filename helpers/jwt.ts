import { readFileSync } from 'fs';
import { decode, type DecodeOptions, type JwtPayload, sign, verify, type SignOptions, type Algorithm, type VerifyOptions, type Jwt } from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { isEmpty } from 'lodash';

//
// constants
//

// BEGIN - Future usage
// const issuer = process.env.JWT_ISSUER ?? 'STEPLIX';
// const audience = process.env.JWT_AUDIENCE ?? 'Steplix';
// END - Future usage

const algorithm = process.env.JWT_ALGORITHM;
const secret = process.env.JWT_SECRET ?? 'SECRET';
const publicKeyFile = !isEmpty(process.env.JWT_PUBLIC_KEY_FILE) ? readFileSync(process.env.JWT_PUBLIC_KEY_FILE as string) : null;
const privateKeyFile = !isEmpty(process.env.JWT_PRIVATE_KEY_FILE) ? readFileSync(process.env.JWT_PRIVATE_KEY_FILE as string) : null;
const secretOrPublicKey = process.env.JWT_PUBLIC_KEY ?? publicKeyFile ?? secret;
const secretOrPrivateKey = process.env.JWT_PRIVATE_KEY ?? privateKeyFile ?? secret;

//
// main class
//
class JWT {
    /**
   * Generate JWT
   */
    sign (payload: string | object | Buffer, options: SignOptions = {}): string {
        if (algorithm !== undefined) options.algorithm = algorithm as Algorithm;
        // Adding in future usage: options.issuer = issuer;

        try {
            return sign(payload, secretOrPrivateKey, options);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
   * Get the payload of the jwt without verifying if the signature is valid.
   */
    decode (token: string, options?: DecodeOptions): string | JwtPayload | null {
        return decode(token, options);
    }

    /**
   * The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid.
   * If not, it will be called with the error.
   */
    verify (token: string, options: VerifyOptions = {}): string | Jwt | JwtPayload {
        if (algorithm !== undefined) options.algorithms = [algorithm as Algorithm];
        // Adding in future usage: options.issuer = issuer;
        // Adding in future usage: options.audience = audience;

        try {
            return verify(token, secretOrPublicKey, options);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
        }
    }
}

export const jwt = new JWT();
