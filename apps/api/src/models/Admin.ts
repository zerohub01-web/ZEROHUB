import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { Role } from "../types/auth.js";

export interface AdminDocument extends mongoose.Document {
  adminId: string;
  password: string;
  role: Role;
  comparePassword(password: string): Promise<boolean>;
}

const adminSchema = new Schema<AdminDocument>(
  {
    adminId: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["SUPER_ADMIN", "MANAGER"], default: "MANAGER" }
  },
  { timestamps: true }
);

adminSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function comparePassword(password: string) {
  return bcrypt.compare(password, this.password);
};

export const AdminModel = mongoose.model<AdminDocument>("Admin", adminSchema);
