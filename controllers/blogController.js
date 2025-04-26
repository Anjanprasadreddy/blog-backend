const { message } = require('statuses');
const BlogPost = require('../models/BlogPost');

// Create blog (admin only)
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newBlog = new BlogPost({
      title,
      content,
      author: req.user.id,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all blogs (public)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find().populate('author', 'name email');
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update blog (admin only)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    await blog.save();

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete blog (admin only)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBlog = async (req,res)=>{
  try{
    const id = req.params.id;
    const blog = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if(!blog){ return res.status(404).json({message: 'Blog not found'})};
    res.status(200).json(blog);
  }catch(err){
    res.status(500).json({message: err.message});
  }
}