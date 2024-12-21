import connectMongoDB from "@/lib/mongodb";
import Group from "@/models/Group";
import Contact from "@/models/Contact";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const userId = req.headers.get("X-User-Id");

  console.log(userId);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();

    const user = await User.findById(userId);

    // Ensure user is on Gold Plan
    if (user.plan !== "gold") {
      return NextResponse.json(
        { error: "Forbidden: Only users on Gold Plan can create groups" },
        { status: 403 }
      );
    }

    const { groupName, contacts } = await req.json();

    if (!groupName || !contacts || !Array.isArray(contacts)) {
      return NextResponse.json(
        { error: "Bad Request: groupName and contacts array are required" },
        { status: 400 }
      );
    }

    // Validate contacts exist
    const validContacts = await Contact.find({
      _id: { $in: contacts },
      userId,
    });

    if (validContacts.length !== contacts.length) {
      return NextResponse.json(
        { error: "Some contacts are invalid or do not belong to the user" },
        { status: 400 }
      );
    }

    const newGroup = await Group.create({
      groupName,
      contacts,
      owner: userId,
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error.message);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
};
