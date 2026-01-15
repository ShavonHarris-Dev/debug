import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { CodeSource } from '@/types';

export interface IPostDocument extends Document {
  author: Types.ObjectId;
  title: string;
  description: string;
  code: string;
  language: string;
  source: CodeSource;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDocument>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    code: {
      type: String,
      required: true,
      maxlength: 50000,
    },
    language: {
      type: String,
      required: true,
      lowercase: true,
    },
    source: {
      type: String,
      enum: ['ai', 'colleague', 'personal', 'other'] as CodeSource[],
      default: 'other',
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ language: 1, createdAt: -1 });
PostSchema.index({ source: 1, createdAt: -1 });
PostSchema.index({ title: 'text', description: 'text' });

const Post: Model<IPostDocument> =
  mongoose.models.Post || mongoose.model<IPostDocument>('Post', PostSchema);

export default Post;
