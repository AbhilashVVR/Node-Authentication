const express = require("express");
const router = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
router.route("/register").post(async (req, res) => {
  const error = await registerValidation(req.body);
  if (error.error?.details) {
    console.log("error", error);
    return res.status(400).send(error.error.details[0].message);
  }

  //Checking if hte user already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const result = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});
router.route("/login").post(async (req, res) => {
  const error = await loginValidation(req.body);
  if (error.error?.details) {
    console.log("error", error);
    return res.status(400).send(error.error.details[0].message);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is doesn't exist");
  //PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");
  //Create a web token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
