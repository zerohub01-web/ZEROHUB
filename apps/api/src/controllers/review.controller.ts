import { Request, Response } from 'express';
import Review from '../models/Review.model.js';

// CLIENT: Submit or update own review
export const submitReview = async (req: Request, res: Response) => {
  try {
    const { rating, testimonial } = req.body;
    const client = (req as any).customer;

    if (!rating || !testimonial) {
      return res.status(400).json({ message: 'Rating and testimonial are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (testimonial.length > 500) {
      return res.status(400).json({ message: 'Testimonial must be under 500 characters' });
    }

    // Get customer details to get name
    // Assuming customerId is available in req.customer from middleware
    const review = await Review.findOneAndUpdate(
      { clientId: client.customerId },
      {
        clientId: client.customerId,
        clientName: client.name ? client.name.split(' ')[0] : 'Client', // Fallback if name not in token
        rating,
        testimonial,
        approved: false // Reset to pending on edit
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Review submitted successfully', review });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CLIENT: Get own review
export const getOwnReview = async (req: Request, res: Response) => {
  try {
    const client = (req as any).customer;
    const review = await Review.findOne({ clientId: client.customerId });
    res.status(200).json({ review: review || null });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUBLIC: Get all approved reviews
export const getApprovedReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ approved: true })
      .select('clientName rating testimonial createdAt')
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADMIN: Get all reviews (approved + pending)
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADMIN: Approve a review
export const approveReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review approved', review });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADMIN: Reject/delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: 'Review deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
