const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail.js')

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser && existingUser.verified) return res.status(400).json({ message: 'User already exists' });
    let verificationToken;
    if(existingUser && !existingUser.verified){
      existingUser.name = name;
      existingUser.password = password
      await existingUser.save();
      verificationToken = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // short expiry
      );
    }else{
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      verificationToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // short expiry
      );
    }
    // Send verification email
    const verifyUrl = `http://localhost:3000/verify?token=${verificationToken}`;

    await sendEmail(
      email,
      'Verify your email',
      `<h2>Hello ${name}</h2>
       <p>Click the link below to verify your email:</p>
       <a href="${verifyUrl}">Verify Email</a>`
    );

    res.status(201).json({ message: 'Registration successful! Please check your email to verify.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
