/** @format */
const User = require("../models/user.js");

//!signup get
module.exports.signupUser = (req, res) => {
  res.render("users/signup.ejs");
};
//!signup page user
module.exports.signupUserpost = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ email, password, username });
    const registerduser = await User.register(newuser, password);
    console.log(registerduser);
    req.login(registerduser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wonderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};
//!login user
module.exports.loginUser = (req, res) => {
  res.render("users/login.ejs");
};
//!loginUserpost
module.exports.loginUserpost = async (req, res) => {
  req.flash("success", "Welcome to Wonderlust! You are Logged in!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};
//!logoutUser
module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out!");
    res.redirect("/listings");
  });
};
