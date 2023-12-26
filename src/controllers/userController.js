const { validateEmail } = require("../utilities/regex");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, dateOfBirth, countryOfOrigin } =
      req.body;

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const emailFormCorrect = validateEmail(email);
    if (!emailFormCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Email form incorrect" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth),
      countryOfOrigin,
    });

    await newUser.save();

    const userForResponse = {
      username: newUser.username,
      email: newUser.email,
      dateOfBirth: newUser.dateOfBirth,
      countryOfOrigin: newUser.countryOfOrigin,
    };

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userForResponse,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Error creating user", error: err });
  }
};

const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error logging in", error: err });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
