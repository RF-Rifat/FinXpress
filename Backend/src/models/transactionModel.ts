import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

export interface ITransaction extends Document {
  transactionId: string;
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
  amount: number;
  fee: number;
  type: "sendMoney" | "cashOut" | "cashIn";
  status: "pending" | "success" | "failed";
  timestamp: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    transactionId: { type: String, unique: true, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ["send-money", "cash-out", "cash-in"],
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model<ITransaction>("Transaction", transactionSchema);
