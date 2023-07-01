const userModal = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = function (id) {
  return jwt.sign({ id }, "authAppKarthik", {
    expiresIn: 60 * 60 * 24,
  });
};

const generateColor = function() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * 16);
    color += letters[randomIndex];
  }
  return color;
}

module.exports.homePage = function (req, res) {
  res.render("home");
};

module.exports.getSignup = function (req, res, next) {
  res.render("signup");
};

module.exports.postSignup = async function (req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const repeatPassword = req.body.repeatPassword;
  let passwordErr = 0;
  if (password !== repeatPassword) {
    passwordErr = 1;
    res.status(400).send({ message: "passwords not matching" });
    res.end();
  }

  //trying to save it to the database
  try {
    if(passwordErr) next(err);
    const user = await userModal.create({ name, email, password, color: generateColor() });
    res.cookie("jwt", createToken(user._id), { httpOnly: true });
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

module.exports.getLogin = function (req, res) {
  res.render("login");
};

module.exports.postLogin = async function (req, res, next) {
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;
  console.log(enteredEmail, enteredPassword);
  const user = await userModal.findOne({ email: enteredEmail });
  if (user) {
    const auth = await bcrypt.compare(enteredPassword, user.password);
    if (auth) {
      res.cookie("jwt", createToken(user._id), { httpOnly: true });
      res.redirect("/");
    } else {
      res.status(400).json({ email: "incorrect password" });
    }         
  } else {
    res.status(400).json({ email: "incorrect email" });
  }
};

module.exports.getLogout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 10 });
  res.redirect("/");
};
