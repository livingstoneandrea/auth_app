import connectMongoDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import User from "@/models/User";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {
  const userId = req.headers.get("X-User-Id");
  const userRole = req.headers.get("X-User-Role");

  // Check if userId and userRole headers are present
  if (!userId || !userRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Forbidden: User not found or invalid permissions" },
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

    const { name, email, phone } = await req.json();

    const newContact = await Contact.create({
      userId,
      name,
      email,
      phone,
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Error adding contact:", error);
    return NextResponse.json(
      { error: "Failed to add contact" },
      { status: 500 }
    );
  }
};
