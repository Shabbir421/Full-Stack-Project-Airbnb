/** @format */

const Listing = require("../models/listing");

//!index listing
module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
};
//!new listing
module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
};
//!show listing
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);

  res.render("listings/show.ejs", { listing });
};
//!createListing
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  if (!req.body.listing) {
    throw new ExpressError(400, "Invalid listing data");
  }
  const { title, description, price, image, location, country } =
    req.body.listing;
  const newListing = new Listing({
    title,
    description,
    image,
    price,
    location,
    country,
  });
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
//!editListing
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  let originalimageurl = listing.image.url;
  originalimageurl = originalimageurl.replace("/upload", "/upload/w_250");
  console.log(listing); // Log the listing object to ensure it is retrieved correctly
  res.render("listings/edit.ejs", { listing, originalimageurl });
};
//!updateListing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", " Listing Updated!");
  res.redirect(`/listings/${id}`);
};
//!deleteListing
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletelisting = await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
};
