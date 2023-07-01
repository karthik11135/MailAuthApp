var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {requireAuth, getUser} = require('./middleware/authMiddleware');

const authRouter = require("./routes/auth");
const mailRouter = require('./routes/mail');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//mongoose connection to database
mongoose
  .connect(
    "mongodb+srv://karthikdmy11135:Password11135@cluster0.y0znkwz.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {  
    console.log("connected");
  })
  .catch((err) => {
    console.error("Error connecting", err);
  });

//custom routees
app.use('*', getUser);
app.use("/", authRouter);
app.use("/" ,mailRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send({ message: err.message });
  // res.render("error");
});

module.exports = app;
