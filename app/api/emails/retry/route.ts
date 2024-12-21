// app/api/emails/retry/route.ts
import connectMongoDB from "@/lib/mongodb";
import { authMiddleware } from "@/middleware/auth";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const userId = req.headers.get("X-User-Id");
  const userRole = req.headers.get("X-User-Role");

  if (!userId || !userRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { emailId } = await req.json();

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
    const allowedRoles = ["frontend"];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    if (user.plan === "gold") {
      ///Logic to retry the email
      // @todo update email status and re-send it

      return NextResponse.json(
        { message: "Email retried successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Only user with gold plan can retry email" },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retry email" },
      { status: 500 }
    );
  }
};
