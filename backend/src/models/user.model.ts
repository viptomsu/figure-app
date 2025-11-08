// user.model.ts
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface IUser {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  fullName?: string;
  avatar?: string;
  resetPasswordToken?: string;
  role: UserRole;
  address?: string;
  isDelete: boolean;
  active: boolean;
}

export interface IUserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): string;
  isEnabled(): boolean;
}

export type UserDocument = mongoose.Document & IUser & IUserMethods;

const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  fullName: { type: String },
  avatar: { type: String },
  resetPasswordToken: { type: String },
  role: {
    type: String,
    enum: ["ADMIN", "STAFF", "CUSTOMER"],
    required: true,
  },
  address: { type: String },
  isDelete: { type: Boolean, default: false },
  active: { type: Boolean, default: true }, // Hoạt động khi không bị xóa
});

// Generate access token
userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );
};

// Method to check if the user account is enabled (not deleted)
userSchema.methods.isEnabled = function (): boolean {
  return !this.isDelete;
};

const User: mongoose.Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
export default User;