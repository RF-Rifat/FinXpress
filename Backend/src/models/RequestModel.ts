import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  agent: mongoose.Types.ObjectId;
  type: "recharge" | "withdraw";
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const requestSchema = new Schema<IRequest>(
  {
    agent: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["recharge", "withdraw"], required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRequest>("Request", requestSchema);
