import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const protectedRoutes = [
    "/dashboard",
    "/dashboard/tasks",
    "/dashboard/customers",
  ];

  const path = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Get auth cookie from Supabase
  const supabaseAuth = request.cookies.get(
    "sb-access-token"
  )?.value;

  // If trying to access protected route without auth
  if (isProtected && !supabaseAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}