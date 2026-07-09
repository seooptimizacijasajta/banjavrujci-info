import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const LOCALES = ["en", "de"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const seg = pathname.split("/")[1];
  const locale = LOCALES.includes(seg) ? seg : "sr";

  // The locale-independent (Serbian) path, used for hreflang alternates.
  const basePath = locale === "sr" ? pathname : pathname.slice(locale.length + 1) || "/";

  // Forward the detected locale + base path to server components via request headers.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-pathname", basePath);

  let response: NextResponse;
  if (locale === "sr") {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  } else {
    // Strip the /en or /de prefix and serve the underlying route internally.
    const url = request.nextUrl.clone();
    url.pathname = basePath;
    response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
