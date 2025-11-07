import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token) {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  console.log("🛡️ Middleware triggered for:", request.nextUrl.pathname);
  console.log("🛡️ Request method:", request.method);

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("🛡️ Admin route detected");

    // Skip middleware for login page
    if (request.nextUrl.pathname === "/admin/login") {
      console.log("🛡️ Login page - allowing access");
      return NextResponse.next();
    }

    // Get token from cookie
    const token = request.cookies.get("adminToken")?.value;
    console.log("🛡️ Token from cookie:", token ? "Exists" : "Missing");

    if (!token) {
      console.log("🛡️ No token - redirecting to login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify token without database calls
    const decoded = await verifyToken(token);
    console.log("🛡️ Decoded token:", decoded);

    if (!decoded || !["superadmin", "admin"].includes(decoded.role)) {
      console.log("🛡️ Invalid token or role - redirecting");
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.set("adminToken", "", { maxAge: 0 });
      return response;
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-role", decoded.role);

    console.log("🛡️ Headers added - x-user-id:", decoded.userId);
    console.log("🛡️ Headers added - x-user-role:", decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Protect API admin routes
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    console.log("🛡️ Admin API route detected:", request.nextUrl.pathname);

    // Get token from cookie
    const token = request.cookies.get("adminToken")?.value;
    console.log("🛡️ API Token from cookie:", token ? "Exists" : "Missing");

    if (!token) {
      console.log("🛡️ API No token - returning 401");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await verifyToken(token);
    console.log("🛡️ API Decoded token:", decoded);

    if (!decoded || !["superadmin", "admin"].includes(decoded.role)) {
      console.log("🛡️ API Invalid token or role - returning 401");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Add user info to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-role", decoded.role);

    console.log("🛡️ API Headers added - x-user-id:", decoded.userId);
    console.log("🛡️ API Headers added - x-user-role:", decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  console.log("🛡️ Route not protected - allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
