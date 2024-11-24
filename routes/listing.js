/** @format */

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  newForm,
  showListing,
  createListing,
  editListing,
  updateListing,
  deleteListing,
} = require("../controllers/listings.js");

//! upload file using multer
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//! index route and create route
//! combined same route as single route for better view
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isloggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(createListing)
  );

//! new route
router.get("/new", isloggedIn, newForm);

//! update route and delete show route
router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isloggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isloggedIn, isOwner, wrapAsync(deleteListing));

//! edit route
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(editListing));

module.exports = router;
