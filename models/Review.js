import mongoose, { mongo } from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  ratings: Number,
  comment: String,
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
