import connectMongoDB from "@/lib/mongodb";
import Email from "@/models/Email";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request, { params }: any) => {
  const userId = req.headers.get("X-User-Id");
  const userRole = req.headers.get("X-User-Role");

  if (!userId || !userRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { emailId } = params;

  try {
    await connectMongoDB();
    // Validate userRole
    const allowedRoles = ["admin", "frontend"];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }
    const email = await Email.findById(emailId);

    if (!email || email.sender.toString() !== userId.toString()) {
      return NextResponse.json(
        { error: "Email not found or unauthorized" },
        { status: 404 }
      );
    }

    await Email.findByIdAndDelete(emailId);

    return NextResponse.json(
      { message: "Email deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete email" },
      { status: 500 }
    );
  }
};
