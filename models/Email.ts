// models/Email.ts
import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IEmail extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: string;
  subject: string;
  body: string;
  status: "sent" | "failed";
  createdAt: Date;
}

const EmailSchema = new Schema<IEmail>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: ["sent", "failed"], default: "sent" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Email = models.Email || model<IEmail>("Email", EmailSchema);

export default Email;
