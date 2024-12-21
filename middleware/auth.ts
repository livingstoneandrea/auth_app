// app/middleware/auth.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectMongoDB from "@/lib/mongodb";

export const authMiddleware =
  (allowedRoles: string[] = []) =>
  async (handler: (req: any, context: any) => Promise<any>) =>
  async (req: Request, context: any) => {
    try {
      console.log("middleware called");

      const token = req.headers.get("Authorization")?.split(" ")[1];

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      await connectMongoDB();

      const user = await User.findById(decoded.id);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check if user has at least one of the required roles
      if (
        allowedRoles.length &&
        !allowedRoles.some((role) => user.role.includes(role))
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Add user info to request for downstream use
      req.headers.set("X-User-Id", user._id.toString());

      context.user = user;
      return handler(req, context);
    } catch (error) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
