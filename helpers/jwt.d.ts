declare class JWT {
    /**
     * Generate JWT
     */
    sign(payload: any, options?: any): string;
    /**
     * Get the payload of the jwt without verifying if the signature is valid.
     */
    decode(token: string, options?: any): import("jsonwebtoken").Jwt;
    /**
     * The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid.
     * If not, it will be called with the error.
     */
    verify(token: string, options?: any): import("jsonwebtoken").Jwt;
}
export declare const jwt: JWT;
export {};
