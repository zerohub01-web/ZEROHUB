import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  clientId: mongoose.Types.ObjectId;
  clientName: string;
  rating: number;
  testimonial: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      unique: true  // One review per client
    },
    clientName: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    testimonial: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    approved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
