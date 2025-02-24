import { Schema, model } from 'mongoose';
import { ICommunity, CommunityModel } from './community.interface';

const communityReplySchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const communitySchema = new Schema<ICommunity>(
  {
    question: {
      type: String
    },
    file: {
      type: String
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    replies: [communityReplySchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Community = model<ICommunity, CommunityModel>('Community', communitySchema);