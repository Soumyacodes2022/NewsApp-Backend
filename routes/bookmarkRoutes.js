const express = require('express');
const {
  getBookmarks,
  getBookmark,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} = require('../controllers/bookmarkController');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/').get(getBookmarks).post(createBookmark);

router
  .route('/:id')
  .get(getBookmark)
  .put(updateBookmark)
  .delete(deleteBookmark);

module.exports = router;
