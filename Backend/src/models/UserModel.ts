import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  pin: string;
  mobileNumber: string;
  email: string;
  accountType: "USER" | "AGENT" | "ADMIN";
  nid: string;
  balance: number;
  income: number;
  status: "PENDING" | "ACTIVE" | "BLOCKED";
  currentSession: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpire: Date | null;
  createdAt: Date;
  updatedAt: Date;
  verifyPin(pin: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    pin: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    accountType: {
      type: String,
      enum: ["USER", "AGENT", "ADMIN"],
      required: true,
    },
    nid: { type: String, required: true, unique: true, trim: true },
    balance: {
      type: Number,
      default: function (this: IUser) {
        return this.accountType === "USER"
          ? 40
          : this.accountType === "AGENT"
          ? 100000
          : 0;
      },
    },
    income: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "BLOCKED"],
      default: function (this: IUser) {
        return this.accountType === "AGENT" ? "PENDING" : "ACTIVE";
      },
    },
    currentSession: { type: String, default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("pin")) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

userSchema.methods.verifyPin = async function (pin: string): Promise<boolean> {
  return bcrypt.compare(pin, this.pin);
};

export default mongoose.model<IUser>("User", userSchema);
