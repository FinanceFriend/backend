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

module.exports = {
  registerUser,
};