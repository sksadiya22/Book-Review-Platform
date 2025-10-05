const router = require('express').Router();
const auth = require('../middlewares/auth');
const bookCtrl = require('../controllers/bookController');

// Public: list with pagination + search/filter
router.get('/', bookCtrl.listBooks);

// Public: book details with reviews
router.get('/:id', bookCtrl.getBook);

// Protected: create, update, delete
router.post('/', auth, bookCtrl.createBook);
router.put('/:id', auth, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
