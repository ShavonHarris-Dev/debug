import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICommentDocument extends Document {
  post: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  lineReference?: number | null;
  parentComment?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    lineReference: {
      type: Number,
      min: 1,
      default: null,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ post: 1, createdAt: 1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1 });

const Comment: Model<ICommentDocument> =
  mongoose.models.Comment || mongoose.model<ICommentDocument>('Comment', CommentSchema);

export default Comment;
