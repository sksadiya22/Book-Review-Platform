const router = require('express').Router();
const auth = require('../middlewares/auth');
const reviewCtrl = require('../controllers/reviewController');

// Create review for a book (protected)
router.post('/book/:bookId', auth, reviewCtrl.addReview);

// Update / delete a review (protected)
router.put('/:id', auth, reviewCtrl.updateReview);
router.delete('/:id', auth, reviewCtrl.deleteReview);

module.exports = router;
