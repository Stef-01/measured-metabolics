import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/db";

const PUBLIC_PATHS = [
  "/",
  "/demo",
  "/sign-in",
  "/auth/callback",
  "/api/assessment",
  "/privacy",
  "/terms",
  "/_next",
  "/favicon.ico",
];
const PERSONA_BASE: Record<string, string> = {
  patient: "/p/home",
  dietitian: "/d/dashboard",
  gp: "/gp",
  admin: "/admin",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (toSet) => {
        for (const c of toSet) res.cookies.set(c.name, c.value, c.options);
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const needsAuth = !PUBLIC_PATHS.some((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p),
  );
  if (needsAuth && !user) {
    const redirect = req.nextUrl.clone();
    redirect.pathname = "/sign-in";
    redirect.searchParams.set("from", pathname);
    return NextResponse.redirect(redirect);
  }

  if (user && pathname === "/sign-in") {
    const result = await supabase
      .from("memberships")
      .select("role")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("role", { ascending: true })
      .limit(1)
      .maybeSingle();
    const m = result.data as { role: string } | null;
    const role = (m?.role ?? "patient") as keyof typeof PERSONA_BASE;
    const target = PERSONA_BASE[role] ?? "/";
    const redirect = req.nextUrl.clone();
    redirect.pathname = target;
    redirect.search = "";
    return NextResponse.redirect(redirect);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
