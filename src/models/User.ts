import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserDocument extends Document {
  githubId: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ username: 'text', name: 'text' });

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
