export const AUTH_SESSION_LIFETIME_S = 60;

export const JWT_SECRET="JWT_SECRET"

export const JWT_EXPIRATION=`${AUTH_SESSION_LIFETIME_S}s`;

export const COOKIE_NAME="barmaid-auth"

export const COOKIE_MAX_AGE_MS=AUTH_SESSION_LIFETIME_S*1000;

export const COOKIE_DOMAIN="ungear.net";