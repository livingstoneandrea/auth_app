import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    email,
    password,
    role = "frontend",
    plan,
    first_name,
    last_name,
    msisdn,
  } = await request.json();

  await connectMongoDB();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      plan: plan || "free", // Explicitly ensure default value is "free" if not provided
      first_name,
      last_name,
      msisdn,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed", details: error.message },
      { status: 500 }
    );
  }
}
