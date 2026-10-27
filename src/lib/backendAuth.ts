import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  accessTokenCookieOptions,
  clearAccessTokenCookieOptions,
} from "./auth/cookies";

export { ACCESS_TOKEN_COOKIE, accessTokenCookieOptions, clearAccessTokenCookieOptions };

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}
