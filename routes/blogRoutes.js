const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  getBlog
} = require('../controllers/blogController');

const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Public route to view all blogs
router.get('/', getAllBlogs);
router.get('/:id',getBlog)
// Admin-only routes
router.post('/create', authenticateToken, authorizeRoles('admin'), createBlog);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateBlog);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteBlog);

module.exports = router;
