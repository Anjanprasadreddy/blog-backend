const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize app
const app = express();

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const usersRoutes = require('./routes/usersRoutes')
// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Blog Platform API is running...');
});


app.use('/api/auth', authRoutes);

app.use('/api/blogs', blogRoutes);

app.use('/api/users', usersRoutes)

app.get('/api/verify', async (req, res) => {
  const token = req.query.token;
  
  if (!token) return res.status(400).json({ message: 'Invalid token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.verified = true;
    await user.save();

    res.send(`<h2>Email verified successfully!</h2><p>You can now <a href="/">Login</a>.</p>`);

  } catch (err) {
    
    res.status(400).json({ message: err.message });
  }
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
