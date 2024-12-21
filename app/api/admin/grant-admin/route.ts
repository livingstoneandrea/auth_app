import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  const superAdminId = req.headers.get("X-User-Id");
  const superAdminRole = req.headers.get("X-User-Role");

  // Check if user is authenticated and has admin privileges
  if (!superAdminId || !superAdminRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (superAdminRole !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only admin users can update roles" },
      { status: 403 }
    );
  }

  try {
    await connectMongoDB();

    const { targetUserId } = await req.json();

    // Validate input
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Bad Request: targetUserId is required" },
        { status: 400 }
      );
    }

    // Check if the requesting user is a superuser
    const superAdminUser = await User.findById(superAdminId);
    if (!superAdminUser || !superAdminUser.isSuperUser) {
      return NextResponse.json(
        { error: "Forbidden: Only superusers can grant admin roles" },
        { status: 403 }
      );
    }

    // Check if the target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "Not Found: Target user does not exist" },
        { status: 404 }
      );
    }

    targetUser.role = "admin";
    await targetUser.save();

    return NextResponse.json(
      { message: `User ${targetUser.name} is now an admin` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error granting admin role:", error.message);
    return NextResponse.json(
      { error: "Failed to grant admin role" },
      { status: 500 }
    );
  }
};
