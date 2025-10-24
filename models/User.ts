// models/User.ts
import mongoose, { Schema, model, models } from "mongoose";

export type IUser = {
  name?: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const UserModel = models.User || model<IUser>("User", UserSchema);
export default UserModel;
