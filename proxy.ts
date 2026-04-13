import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedMatchers = ["/", "/habits", "/reports", "/alerts", "/settings"];

export async function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl;
	const isProtectedRoute = protectedMatchers.some((route) =>
		route === "/"
			? pathname === route
			: pathname === route || pathname.startsWith(`${route}/`),
	);

	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
	});

	if (token) {
		return NextResponse.next();
	}

	const signInUrl = new URL("/portal", request.url);
	signInUrl.searchParams.set("callbackUrl", `${pathname}${search}` || "/");
	return NextResponse.redirect(signInUrl);
}

export const config = {
	matcher: [
		"/",
		"/habits/:path*",
		"/reports/:path*",
		"/alerts/:path*",
		"/settings/:path*",
	],
};
