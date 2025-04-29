const Bookmark = require('../model/Bookmark');

// @desc    Get all bookmarks for a user
// @route   GET /api/v1/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single bookmark
// @route   GET /api/v1/bookmarks/:id
// @access  Private
exports.getBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: `Bookmark not found with id of ${req.params.id}`,
      });
    }

    // Make sure user owns bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to access this bookmark`,
      });
    }

    res.status(200).json({
      success: true,
      data: bookmark,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create new bookmark
// @route   POST /api/v1/bookmarks
// @access  Private
exports.createBookmark = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const bookmark = await Bookmark.create(req.body);

    res.status(201).json({
      success: true,
      data: bookmark,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update bookmark
// @route   PUT /api/v1/bookmarks/:id
// @access  Private
exports.updateBookmark = async (req, res) => {
  try {
    let bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: `Bookmark not found with id of ${req.params.id}`,
      });
    }

    // Make sure user owns bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this bookmark`,
      });
    }

    bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: bookmark,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete bookmark
// @route   DELETE /api/v1/bookmarks/:id
// @access  Private
exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: `Bookmark not found with id of ${req.params.id}`,
      });
    }

    // Make sure user owns bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this bookmark`,
      });
    }

    // Using the recommended method to delete the bookmark
    await Bookmark.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
