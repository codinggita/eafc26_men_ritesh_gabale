import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true
    },
    isBanned: {
      type: Boolean,
      default: false,
      index: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    sessions: {
      type: [
        {
          tokenId: String,
          createdAt: {
            type: Date,
            default: Date.now
          },
          revokedAt: Date
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

UserSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isBanned: this.isBanned,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const User = mongoose.model("User", UserSchema);
