import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const userId = req.headers.get("X-User-Id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();
    console.log(userId);

    const objectId = new mongoose.Types.ObjectId(userId);
    // Fetch user profile with related documents (emails, groups, and contacts)
    const userProfile = await User.aggregate([
      {
        $match: { _id: objectId }, // Match user by ID
      },
      {
        $lookup: {
          from: "emails", // Lookup related emails
          localField: "_id",
          foreignField: "sender",
          as: "emails",
        },
      },
      {
        $lookup: {
          from: "groups",
          localField: "_id",
          foreignField: "owner",
          as: "groups",
        },
      },
      {
        $lookup: {
          from: "contacts", // Lookup related contacts
          localField: "_id",
          foreignField: "userId", // Assumes the `userId` field in `Contact` refers to `User._id`
          as: "contacts",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          first_name: 1,
          last_name: 1,
          msisdn: 1,
          role: 1,
          plan: 1,
          emails: 1,
          groups: 1,
          contacts: 1,
        },
      },
    ]);

    if (userProfile.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userProfile[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
};
