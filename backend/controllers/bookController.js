const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose');

const PAGE_LIMIT = 5;

exports.createBook = async (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;
    if (!title || !author) return res.status(400).json({ message: 'Title and author are required.' });

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      description: description || '',
      genre: genre || '',
      year: year ? Number(year) : undefined,
      addedBy: req.user.id
    });

    res.status(201).json(book);
  } catch (err) {
    console.error('Create book error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.listBooks = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const search = (req.query.search || '').trim();
    const genre = (req.query.genre || '').trim();
    const author = (req.query.author || '').trim();

    const query = {};

    if (search) {
      // search in title or author
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre) {
      query.genre = genre;
    }

    if (author) {
      // author param is additional filter, keep case-insensitive match
      query.author = { $regex: author, $options: 'i' };
    }

    const total = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT)
      .populate('addedBy', 'name');

    // get avg ratings using aggregation for the returned book ids
    const bookIds = books.map(b => b._id);

    const ratingsAgg = await Review.aggregate([
      { $match: { bookId: { $in: bookIds.map(id => mongoose.Types.ObjectId(id)) } } },
      { $group: { _id: '$bookId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const ratingMap = {};
    ratingsAgg.forEach(r => {
      ratingMap[r._id.toString()] = { avg: r.avgRating, count: r.count };
    });

    const data = books.map(b => ({
      _id: b._id,
      title: b.title,
      author: b.author,
      description: b.description,
      genre: b.genre,
      year: b.year,
      addedBy: b.addedBy,
      avgRating: ratingMap[b._id.toString()] ? Number((ratingMap[b._id.toString()].avg).toFixed(2)) : 0,
      reviewsCount: ratingMap[b._id.toString()] ? ratingMap[b._id.toString()].count : 0,
      createdAt: b.createdAt
    }));

    res.json({
      data,
      page,
      totalPages: Math.ceil(total / PAGE_LIMIT),
      total
    });
  } catch (err) {
    console.error('List books error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid id' });

    const book = await Book.findById(bookId).populate('addedBy', 'name');
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ bookId: book._id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

    res.json({
      book,
      reviews,
      avgRating: Number(avgRating.toFixed(2)),
      reviewsCount: reviews.length
    });
  } catch (err) {
    console.error('Get book error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid id' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this book' });
    }

    const allowed = ['title', 'author', 'description', 'genre', 'year'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) book[field] = req.body[field];
    });

    await book.save();
    res.json(book);
  } catch (err) {
    console.error('Update book error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({ message: 'Invalid id' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    // Delete related reviews
    await Review.deleteMany({ bookId: book._id });

    await book.remove();
    res.json({ message: 'Book removed' });
  } catch (err) {
    console.error('Delete book error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
