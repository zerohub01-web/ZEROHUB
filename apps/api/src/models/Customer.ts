import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface CustomerDocument extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  authProvider: "local" | "google";
  isVerified: boolean;
  verificationToken?: string;
  verificationExpires?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const customerSchema = new Schema<CustomerDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationExpires: { type: Date }
  },
  { timestamps: true }
);

customerSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

customerSchema.methods.comparePassword = async function comparePassword(password: string) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export const CustomerModel = mongoose.model<CustomerDocument>("Customer", customerSchema);
