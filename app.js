/** @format */
//MVC= model,view,controller : its a way to write a combind code (full stack project)
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate"); //use for template create like navbar
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStratagy = require("passport-local");
const User = require("./models/user.js");
//*
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const mongourl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

async function main() {
  try {
    await mongoose.connect(mongourl, {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

main()
  .then(() => {
    console.log("connected db");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //urlencoded is middleware function
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public"))); //static is middleware function

//! mongo store
const store = MongoStore.create({
  mongoUrl: mongourl,
  crypto: {
    secret: process.env.SECRETE,
  },
  touchAfter: 24 * 3600,
});
store.once("error", () => {
  console.log("error in mongo session store", err);
});
//! session require
const sessionoption = {
  store,
  secret: process.env.SECRETE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Convert timestamp
    maxAge: 7 * 24 * 60 * 60, // maxAge in seconds
    httpOnly: true,
  },
};

//!root
app.get("/", (req, res) => {
  res.send("connected");
});

app.use(session(sessionoption));
app.use(flash());

//! passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratagy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//!middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//! listing routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); //parent route
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found !"));
});

//!middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});
app.listen(3000);
