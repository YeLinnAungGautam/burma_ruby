import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "./dbConnect";

export async function verifyToken(request) {
  try {
    let token;

    // Check headers first (for API routes)
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
    // Check cookies (for server components)
    else if (request.cookies?.get("adminToken")) {
      token = request.cookies.get("adminToken").value;
    }

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only fetch user from database if we're not in middleware
    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password");
    return user;
  } catch (error) {
    return null;
  }
}

export function generateToken(userId, role) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

export async function requireAuth(request, roles = ["admin", "superadmin"]) {
  const user = await verifyToken(request);

  if (!user) {
    throw new Error("Authentication required");
  }

  if (!roles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }

  return user;
}

// Simple token verification without DB (for client-side)
export function verifyTokenWithoutDB(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
