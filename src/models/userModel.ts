import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

type UserDocument = Document & {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  comparePassword(userPassword: string): Promise<boolean>;
};

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.hash(this.password, 10);
  this.password = salt;
  next();
});

userSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
