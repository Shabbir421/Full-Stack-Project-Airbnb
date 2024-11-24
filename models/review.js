/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String, // Use Mongoose's String type
    required: true, // Ensure it's required if needed
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Ensure it's required if needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author:{
    type:Schema.Types.ObjectId,
    ref:"user"
  }
});

module.exports = mongoose.model("Review", reviewSchema);
