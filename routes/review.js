const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../Schema.js");
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");
const { isloggedin } = require("../middleware.js");
const reviewController = require("../controller/review.js");

// Middleware for validating review input
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// ✅ Create review
router.post("/", isloggedin, validateReview, wrapAsync(reviewController.createReview));


// ✅ Delete review
router.delete("/:reviewId", isloggedin, wrapAsync(reviewController.deleteReview));

module.exports = router;
