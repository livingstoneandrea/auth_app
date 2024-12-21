import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  const adminUserId = req.headers.get("X-User-Id");
  const adminUserRole = req.headers.get("X-User-Role");

  // Check if user is authenticated and has admin privileges
  if (!adminUserId || !adminUserRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (adminUserRole !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Only admin users can update roles" },
      { status: 403 }
    );
  }

  try {
    await connectMongoDB();

    const { targetUserId, newRole } = await req.json();

    // Validate inputs
    if (!targetUserId || !newRole) {
      return NextResponse.json(
        { error: "Bad Request: targetUserId and newRole are required" },
        { status: 400 }
      );
    }

    // Validate new role
    const allowedRoles = ["admin", "frontend"];
    if (!allowedRoles.includes(newRole)) {
      return NextResponse.json(
        { error: "Bad Request: Invalid role provided" },
        { status: 400 }
      );
    }

    // Check if the requesting user is a superuser
    const adminUser = await User.findById(adminUserId);
    if (!adminUser || !adminUser.isSuperUser) {
      return NextResponse.json(
        { error: "Forbidden: Only superusers can revoke admin roles" },
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

    // Prevent self-demotion
    if (targetUser._id.toString() === adminUserId && newRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: You cannot revoke your own admin role" },
        { status: 403 }
      );
    }

    // Update the role of the target user
    targetUser.role = newRole;
    await targetUser.save();

    return NextResponse.json(
      { message: `User role updated successfully to ${newRole}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error.message);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
};
