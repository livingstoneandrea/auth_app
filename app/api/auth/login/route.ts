// app/api/auth/login/route.ts
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  const { email, password, loginType } = await request.json();

  await connectMongoDB();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userRoles = user.roles || []; // Ensure roles is an array (e.g., ["admin", "frontend"])

    let assignedRole = "frontend"; // Default role

    if (loginType) {
      if (userRoles.includes(loginType)) {
        assignedRole = loginType;
      } else {
        return NextResponse.json(
          {
            error: `Access denied: Role '${loginType}' is not assigned to the user`,
          },
          { status: 403 }
        );
      }
    }

    // Generate JWT token using jose
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      id: user._id.toString(),
      email: user.email,
      role: assignedRole,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    return NextResponse.json(
      { message: "Login successful", token, user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error: ", error);
    return NextResponse.json(
      { error: "Login failed", details: error.message },
      { status: 500 }
    );
  }
}
