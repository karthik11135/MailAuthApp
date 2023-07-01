const mongoose = require("mongoose");
const { Schema } = mongoose;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const usersSchema = new Schema({
  name: {
    type: String,
    required: [true, "Enter your name yo"],
    minlength: [3, "Keep it more than 2 letters"],
    maxlength: [18, "Keep it less than 18 letters"],
  },
  email: {
    type: String,
    required: [true, "Cant continue without a proper email"],
    unique: true,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Set a Password"],
    minlength: 6,
  },
  color: {
    type: String,
  }
});

usersSchema.pre("save", async function (next) {
  
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const User = mongoose.model("user", usersSchema);
module.exports = User;
