
import connectToDatabase from "@/lib/mongodb";
import Contact from "@/models/Contact";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userId, name, email } = req.body;

  await connectToDatabase();

  try {
    const contact = new Contact({ userId, name, email });
    await contact.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error adding contact", details: error.message });
  }
}
