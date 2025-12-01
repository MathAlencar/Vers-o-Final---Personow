import { type CookiesFn, getCookie } from "cookies-next";
import ky from "ky";

const PUBLIC_BASE = process.env.NEXT_PUBLIC_SITE_URL;

// Nota: esta checagem roda no build/servidor. `typeof window === 'undefined'` detecta server.
const prefix =
  typeof window === "undefined" ? `${PUBLIC_BASE}/api/proxy` : "/api/proxy";

export const api = ky.create({
  prefixUrl: prefix, // -> server: "http://localhost:3000/api/proxy", client: "/api/proxy"
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined;
        if (typeof window === "undefined") {
          const { cookies: serverCookies } = await import("next/headers");
          cookieStore = serverCookies;
        }
        const token = await getCookie("token", { cookies: cookieStore });
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
  },
});
