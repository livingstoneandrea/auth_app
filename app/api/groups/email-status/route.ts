import connectMongoDB from "@/lib/mongodb";
import Group from "@/models/Group";
import Email from "@/models/Email";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (req: Request) => {
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
        { error: "Forbidden: Only users on Gold Plan can view email statuses" },
        { status: 403 }
      );
    }

     // Extract groupId from query parameters
     const { searchParams } = new URL(req.url);
     const groupId = searchParams.get("groupId");
 
     if (!groupId) {
       return NextResponse.json(
         { error: "Bad Request: groupId is required" },
         { status: 400 }
       );
     }
 
     const group = await Group.findById(groupId);
 
     if (!group || group.owner.toString() !== userId) {
       return NextResponse.json(
         { error: "Group not found or unauthorized access" },
         { status: 404 }
       );
     }
 
     if (!group.contacts || group.contacts.length === 0) {
       return NextResponse.json(
         { error: "Group has no contacts" },
         { status: 404 }
       );
     }
 
     console.log("Group Contacts:", group.contacts);
 
     // Ensure contacts are valid ObjectIDs
     const contactIds = group.contacts.map((id) =>
       mongoose.Types.ObjectId.isValid(id)
         ? new mongoose.Types.ObjectId(id)
         : null
     );
 
     if (contactIds.includes(null)) {
       return NextResponse.json(
         { error: "Group contains invalid contact IDs" },
         { status: 400 }
       );
     }
 
     // Fetch emails of users in group.contacts
     const userEmails = await User.find(
       { _id: { $in: contactIds } },
       { email: 1, _id: 0 }
     ).lean();
 
     if (!userEmails.length) {
       return NextResponse.json(
         { error: "No users found in group contacts" },
         { status: 404 }
       );
     }
 
     const emailList = userEmails.map((user) => user.email);
 
     // Fetch emails from the Email collection using resolved user emails
     const emails = await Email.find({ recipient: { $in: emailList } });
 
     const status = {
       sent: emails.filter((email) => email.status === "sent").length,
       pending: emails.filter((email) => email.status === "pending").length,
       failed: emails
         .filter((email) => email.status === "failed")
         .map((email) => email.recipient),
     };
 
    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error("Error fetching email status:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch email status" },
      { status: 500 }
    );
  }
};
