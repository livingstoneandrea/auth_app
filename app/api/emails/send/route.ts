import connectMongoDB from "@/lib/mongodb";
import Email from "@/models/Email";
import Contact from "@/models/Contact";

import { NextResponse } from "next/server";
import User from "@/models/User";

import EmailService, { EmailPayload } from "@/lib/emailService";

//create an email service
const emailService = new EmailService(
  process.env.NEXT_PUBLIC_EMAIL_API_URL || "",
  process.env.NEXT_PUBLIC_EMAIL_API_KEY || ""
);

export const POST = async (req: Request) => {
  const userId = req.headers.get("X-User-Id");
  const userRole = req.headers.get("X-User-Role");

  if (!userId || !userRole) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, subject, body } = await req.json();

  try {
    await connectMongoDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: " User not found or invalid permissions" },
        { status: 403 }
      );
    }
    // Validate userRole
    const allowedRoles = ["frontend", "admin"];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const contact = await Contact.findOne({ email });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const newEmail = await Email.create({
      sender: userId,
      recipient: contact.email,
      subject,
      body,
      status: "sent",
    });

    // const sendEmail = async () => {
    //   const payload: EmailPayload = {
    //     to: contact.email || "recipient@example.com",
    //     subject: subject || "Email Subject",
    //     body: body || "<h1>Hello!</h1><p>Thank you for joining us.</p>",
    //     from: user.email || "sender@example.com",
    //   };

    //   try {
    //     const response = await emailService.sendEmail(payload);
    //     if (response.success) {
    //       console.log("Email sent successfully:", response.data);
    //     } else {
    //       console.error("Failed to send email:", response.message);
    //     }
    //   } catch (error) {
    //     console.error("Error sending email:", error);
    //   }
    // };

    // await sendEmail();

    return NextResponse.json(newEmail, { status: 201 });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
};
