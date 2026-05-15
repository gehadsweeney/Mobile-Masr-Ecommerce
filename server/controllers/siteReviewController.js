import SiteReview from "../models/siteReviewModel.js";

// add new site review
const addSiteReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const review = await SiteReview.create({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all site reviews
const getSiteReviews = async (req, res) => {
  try {
    const reviews = await SiteReview.find().populate("user", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete site review (only admin OR review owner)
const deleteSiteReview = async (req, res) => {
  try {
    const review = await SiteReview.findById(req.params.id);

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    // check if user is owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addSiteReview, getSiteReviews, deleteSiteReview };