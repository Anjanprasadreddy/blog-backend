const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail.js')

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
  
    if (!name || name.length < 5) {
      return res.status(400).json({ message: 'Please enter the name with 5 or more characters.' });
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
  
    if (!password || password.length < 7) {
      return res.status(400).json({ message: 'Please enter a password with 7 or more characters.' });
    }
  
    // Check if user exists
    const existingUser = await User.findOne({ email });
  
    let user;
    if (existingUser) {
      if (existingUser.verified) {
        return res.status(400).json({ message: 'User already exists.' });
      }
      // Update unverified user
      existingUser.name = name;
      existingUser.password = await bcrypt.hash(password, 10); // directly hash here
      user = await existingUser.save();
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword });
      await user.save();
    }
  
    // Now user is guaranteed to exist
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  
    const verifyUrl = `http://localhost:3000/verify?token=${verificationToken}`;
  
    // Don't await sendEmail immediately - fire and forget
    sendEmail(
      email,
      'Verify your email',
      `<h2>Hello ${name}</h2>
       <p>Click the link below to verify your email:</p>
       <a href="${verifyUrl}">Verify Email</a>`
    ).catch(err => console.error('Error sending email:', err.message));
  
    res.status(201).json({ message: 'Registration successful! Please check your email to verify.' });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }  
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.verified) return res.status(400).json({ message: 'Please verify your email before logging in.' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create token
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verify = async (req, res)=>{
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
}