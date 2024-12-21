// models/User.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  msisdn: string;
  role: ["frontend" | "admin"];
  plan?: "gold" | "free";
  isSuperUser: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    msisdn: { type: String, required: true },
    role: {
      type: [String],
      enum: ["frontend", "admin"],
      default: ["frontend"],
    },
    isSuperUser: { type: Boolean, default: false },
    plan: { type: String, enum: ["gold", "free"], default: "free" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const User = mongoose.models.User || model<IUser>("User", UserSchema);

export default User;
