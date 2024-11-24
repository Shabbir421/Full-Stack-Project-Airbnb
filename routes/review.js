/** @format */

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {
  validateReview,
  isloggedIn,
  isreviewAuthor,
} = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews.js");

//! review route
router.post("/", isloggedIn, validateReview, wrapAsync(createReview));

//!delete  review route
router.delete(
  "/:reviewId",
  isloggedIn,
  isreviewAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;
