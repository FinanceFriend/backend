const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, //todo hash password
      dateOfBirth: new Date(req.body.dateOfBirth),
      countryOfOrigin: req.body.countryOfOrigin,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser }); //todo - not return password to user
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
};

module.exports = {
  registerUser,
};