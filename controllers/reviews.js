const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req, res) => {
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    await newReview.save();

    await Listing.findByIdAndUpdate(
        req.params.id,
        { $push: { reviews: newReview._id } }
    );

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) =>{
        let{ id, reviewId } = req.params;
        await Review.findById(reviewId);

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
};