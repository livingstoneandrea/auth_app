// app/models/Group.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface GroupDocument extends Document {
  groupName: string;
  owner: mongoose.Types.ObjectId;
  contacts: mongoose.Types.ObjectId[];
  emailStatus: {
    sent: number;
    pending: number;
    failed: { email: string; reason: string }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<GroupDocument>(
  {
    groupName: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contact" }],
    emailStatus: {
      sent: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      failed: [
        {
          email: { type: String, required: true },
          reason: { type: String, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

const Group: Model<GroupDocument> =
  mongoose.models.Group || mongoose.model("Group", GroupSchema);
export default Group;
