const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id);

    if (!foundListing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id; // ✅ Set the author.
    await newReview.save();

    foundListing.review.push(newReview);
    await foundListing.save();

    req.flash("success", "Review created!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove review ID from listing's review array
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });

    // Delete review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}