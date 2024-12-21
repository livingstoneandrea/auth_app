import connectMongoDB from "@/lib/mongodb";
import Email from "@/models/Email";
import { NextResponse } from "next/server";
import User from "@/models/User";

export const GET = async (req: Request) => {
  const userId = req.headers.get("X-User-Id");
  const userRole = req.headers.get("X-User-Role");

  if (!userId || !userRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: " User not found or invalid permissions" },
        { status: 403 }
      );
    }

    // Validate userRole
    const allowedRoles = ["admin", "frontend"];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const emails = await Email.find({ sender: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(emails, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve emails" },
      { status: 500 }
    );
  }
};
