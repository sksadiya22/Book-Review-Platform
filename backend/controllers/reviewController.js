const Review = require('../models/Review');
const Book = require('../models/Book');
const mongoose = require('mongoose');

exports.addReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const bookId = req.params.bookId;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid book id' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    // enforce one review per user per book due to unique index
    const existing = await Review.findOne({ bookId, userId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this book' });

    const review = await Review.create({
      bookId,
      userId,
      rating: Number(rating),
      reviewText: reviewText || ''
    });

    res.status(201).json(review);
  } catch (err) {
    // handle unique index violation gracefully
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    console.error('Add review error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid review id' });

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized to update this review' });

    if (req.body.rating !== undefined) {
      const r = Number(req.body.rating);
      if (r < 1 || r > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      review.rating = r;
    }
    if (req.body.reviewText !== undefined) review.reviewText = req.body.reviewText;

    await review.save();
    res.json(review);
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid review id' });

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized to delete this review' });

    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
