import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register", "/privacy", "/terms"];
const GATE_EXEMPT = ["/access", "/api/access"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Site-wide password gate (only active when SITE_PASSWORD is set)
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword && !GATE_EXEMPT.some((p) => path.startsWith(p))) {
    const cookie = request.cookies.get("site_access")?.value;
    if (cookie !== sitePassword) {
      const url = request.nextUrl.clone();
      url.pathname = "/access";
      url.searchParams.set("from", path);
      return NextResponse.redirect(url);
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = PUBLIC_PATHS.some(
    (p) => path === p || path.startsWith("/api/")
  );

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/pipeline", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
