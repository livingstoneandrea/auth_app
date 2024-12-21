import connectMongoDB from "@/lib/mongodb";
import Group from "@/models/Group";
import Contact from "@/models/Contact";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const userId = req.headers.get("X-User-Id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();

    const user = await User.findById(userId);

    // Ensure user is on Gold Plan
    if (user.plan !== "gold") {
      return NextResponse.json(
        {
          error:
            "Forbidden: Only users on Gold Plan can add contacts to groups",
        },
        { status: 403 }
      );
    }

    const { groupId, contactIds } = await req.json();

    // Validate contactIds (array of valid contact IDs)
    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { error: "Bad Request: contactIds array is required" },
        { status: 400 }
      );
    }

    // Convert contactIds to ObjectId
    const objectIdContacts = contactIds.map((id: string) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    // Fetch the group to ensure the user has permission to modify it
    const group = await Group.findById(groupId);
    if (!group || group.owner.toString() !== userId) {
      return NextResponse.json(
        { error: "Group not found or unauthorized access" },
        { status: 404 }
      );
    }

    // Validate the contacts exist and belong to the user
    const contacts = await Contact.find({
      _id: { $in: objectIdContacts },
      owner: userId,
    });

    if (!contacts) {
      return NextResponse.json(
        { error: "Some contacts do not exist or do not belong to the user" },
        { status: 400 }
      );
    }

    // Add contacts to the group, avoiding duplicates
    group.contacts = [...new Set([...group.contacts, ...objectIdContacts])];
    await group.save();

    return NextResponse.json(
      { message: "Contacts have been added to the group successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding contacts to group:", error.message);
    return NextResponse.json(
      { error: "Failed to add contacts to group", details: error.message },
      { status: 500 }
    );
  }
};
