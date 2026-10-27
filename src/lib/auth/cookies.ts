import { ACCESS_TOKEN_COOKIE } from "./constants";

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function accessTokenCookieOptions(maxAgeSeconds: number) {
  return {
    ...baseCookieOptions,
    maxAge: maxAgeSeconds,
  };
}

export function clearAccessTokenCookieOptions() {
  return {
    ...baseCookieOptions,
    maxAge: 0,
  };
}

export { ACCESS_TOKEN_COOKIE };
