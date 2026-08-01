const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, isAuthor } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isAuthor: isAuthor || false,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Email or username already exists." });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, isAuthor: user.isAuthor },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAuthor: user.isAuthor,
      },
    });
  } catch (err) {
    next(err);
  }
};