/** @format */

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  signupUser,
  signupUserpost,
  loginUser,
  loginUserpost,
  logoutUser,
} = require("../controllers/users.js");

//!signup page
router.route("/signup").get(signupUser).post(wrapAsync(signupUserpost));

//!login page
router
  .route("/login")
  .get(loginUser)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    loginUserpost
  );

//!logout page
router.get("/logout", logoutUser);

module.exports = router;
