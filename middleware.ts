import { jwtVerify, errors as joseErrors } from "jose";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/contacts/:path*",
    "/api/emails/:path*",
    "/api/groups/:path*",
    "/api/users/:path*",
  ], 
};

export async function middleware(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");
    const { payload } = await jwtVerify(token, secret);

    // Check if the token has expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    // Pass decoded payload values to the response headers
    const res = NextResponse.next();
    if (payload.id) res.headers.set("X-User-Id", payload.id.toString());
    if (payload.role) res.headers.set("X-User-Role", String(payload.role));

    return res;
  } catch (error) {
    if (error instanceof joseErrors.JWTExpired) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    if (error instanceof joseErrors.JWTInvalid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.error("Middleware error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
