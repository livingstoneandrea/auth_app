import connectMongoDB from "@/app/libs/mongoDB";
import User from "@/app/models/User";
import Email from "@/app/models/Email";
import Group from "@/app/models/Group";
import { authMiddleware } from "@/app/middleware/auth";
import { NextResponse } from "next/server";

export const DELETE = authMiddleware(["admin"])(async (request, { params }: any) => {
  const { userId } = params;

  await connectMongoDB();

  try {
    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all associated emails
    await Email.deleteMany({ sender: userId });

    // Delete all associated groups
    await Group.deleteMany({ owner: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: "User and all associated data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
});
