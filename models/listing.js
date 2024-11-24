/** @format */

const mongoose = require("mongoose");
const Review = require("./review");
const { string } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Path `title` is required."],
  },
  description: String,
  price: {
    type: Number,
  },
  image: {
    url: String,
    filename: String,
  },

  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  category: {
    type: String,
    enum: ["mountains", "snowflake", "farms", ""],
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ reviews: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
