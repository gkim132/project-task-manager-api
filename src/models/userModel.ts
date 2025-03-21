import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type UserDocument = Document & {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  passwordChangedAt: Date;
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
    trim: true,
    select: false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  passwordChangedAt: {
    type: Date
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
