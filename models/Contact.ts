import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IContact extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Contact = models.Contact || model<IContact>("Contact", ContactSchema);

export default Contact;
