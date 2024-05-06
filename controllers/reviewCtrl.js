import Product from "../models/Product.js";
import Review from "../models/Review.js";
import User from "../models/user.js";
import { getMe } from "./userCtrl.js";

export const allReviews = async (req, res) => {
  let reviews;
  try {
    reviews = await Review.find();

    res.status(200).json({
      success: true,
      message: `There are following reviews`,
      reviews,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `there is following error`,
      error,
    });
  }
};

export const createReview = async (req, res) => {
  const { ratings, comment } = req.body;
  const user = req.user;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Please Login",
    });
  }
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Please enter product id",
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Product id is not matched",
    });
  }
  try {
    const review = new Review({
      user: user,
      product: product,
      ratings,
      comment,
    });
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review is created`,
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: `there is following error`,
      error,
    });
  }
};

export const getReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findById(reviewId);
    console.log(review);
    if (review) {
      res.status(200).json({
        success: true,
        message: `Review is founded`,
        review,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `Review is not found`,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `there is following error`,
      error,
    });
  }
};

export const updateReview = async (req, res) => {
  const { ratings, comment } = req.body;
  console.log(ratings, comment);
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(400).json({
      success: false,
      message: `Review not exist`,
    });
  }
  const reviewOwner = review.user;
  const requestedUser = req.user.id;
  if (reviewOwner == requestedUser) {
    review.ratings = ratings;
    review.comment = comment;
    review.save();
    res.status(200).json({
      success: true,
      message: `Review has updated`,
      review,
    });
  } else {
    res.status(200).json({
      success: true,
      message: `Review has updated`,
      review,
      reviewOwner,
      requestedUser,
    });
  }
};

export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(400).json({
      success: false,
      message: `Review not exist , please try later`,
    });
  }

  const reviewOwner = review.user;
  const requestedUser = req.user.id;
  if (reviewOwner == requestedUser) {
    await Review.deleteOne(review);

    res.status(200).json({
      success: true,
      message: `Review has deleted`,
    });
  } else {
    res.status(200).json({
      success: true,
      message: `You dont have to access to delete this`,
      review,
      reviewOwner,
      requestedUser,
    });
  }
};
