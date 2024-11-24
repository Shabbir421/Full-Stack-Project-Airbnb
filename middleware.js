/** @format */

const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingschema, reviewschema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in!");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id).populate("owner");
  // Check if the current user owns the listing
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to perform this action");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//!validateListing
module.exports.validateListing = (req, res, next) => {
  const { error } = listingschema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

//!validateReview
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewschema.validate(req.body);
  console.log(error);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

//! review author
module.exports.isreviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  let review = await Review.findById(reviewId).populate("author");
  // Check if the current user owns the listing
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have Delete this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
