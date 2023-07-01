const jwt = require("jsonwebtoken");
const userModal = require('../models/users');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "authAppKarthik", (err, dToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const getUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "authAppKarthik",async (err, dToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await userModal.findById(dToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, getUser };
