const User = require("../models/user");

const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      dateOfBirth: new Date(req.body.dateOfBirth),
      countryOfOrigin: req.body.countryOfOrigin,
    });

    await newUser.save();

    const userForResponse = {
      username: newUser.username,
      email: newUser.email,
      dateOfBirth: newUser.dateOfBirth,
      countryOfOrigin: newUser.countryOfOrigin,
    };

    res
      .status(201)
      .json({ message: "User created successfully", user: userForResponse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating user", error: err });
  }
};

module.exports = {
  registerUser,
};
