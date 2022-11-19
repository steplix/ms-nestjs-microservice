"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = void 0;
const fs_1 = require("fs");
const jsonwebtoken_1 = require("jsonwebtoken");
const common_1 = require("@nestjs/common");
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
const publicKeyFile = process.env.JWT_PUBLIC_KEY_FILE ? (0, fs_1.readFileSync)(process.env.JWT_PUBLIC_KEY_FILE) : null;
const privateKeyFile = process.env.JWT_PRIVATE_KEY_FILE ? (0, fs_1.readFileSync)(process.env.JWT_PRIVATE_KEY_FILE) : null;
const secretOrPublicKey = process.env.JWT_PUBLIC_KEY || publicKeyFile || secret;
const secretOrPrivateKey = process.env.JWT_PRIVATE_KEY || privateKeyFile || secret;
//
// main class
//
class JWT {
    /**
     * Generate JWT
     */
    sign(payload, options = {}) {
        options = options || {};
        options.algorithm = algorithm;
        // options.algorithms = algorithms;
        // options.issuer = issuer;
        try {
            return (0, jsonwebtoken_1.sign)(payload, secretOrPrivateKey, options);
        }
        catch (e) {
            throw new common_1.HttpException(e.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get the payload of the jwt without verifying if the signature is valid.
     */
    decode(token, options = {}) {
        return (0, jsonwebtoken_1.decode)(token, options);
    }
    /**
     * The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid.
     * If not, it will be called with the error.
     */
    verify(token, options = {}) {
        options = options || {};
        options.ignoreExpiration = false;
        options.algorithms = algorithms;
        options.algorithm = algorithm;
        // options.issuer = issuer;
        // options.audience = audience;
        try {
            return (0, jsonwebtoken_1.verify)(token, secretOrPublicKey, options);
        }
        catch (e) {
            throw new common_1.HttpException(e.message, common_1.HttpStatus.UNAUTHORIZED);
        }
    }
}
exports.jwt = new JWT();
