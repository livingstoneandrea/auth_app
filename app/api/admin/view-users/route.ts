import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const userId = req.headers.get("X-User-Id");
  const userRole = req.headers.get("X-User-Role");

  // Check if user is authenticated
  if (!userId || !userRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Validate the user's role
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only admin users can access this endpoint" },
        { status: 403 }
      );
    }

    // Fetch all users and their sent emails
    const usersWithEmails = await User.aggregate([
      {
        $lookup: {
          from: "emails", // Collection name for Email
          localField: "_id",
          foreignField: "sender",
          as: "sentEmails",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          sentEmails: {
            recipient: 1,
            subject: 1,
            body: 1,
            status: 1,
            createdAt: 1,
          },
        },
      },
    ]);

    return NextResponse.json(usersWithEmails, { status: 200 });
  } catch (error) {
    console.error("Error fetching users with emails:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch users with emails" },
      { status: 500 }
    );
  }
};
