import Reviews from '../models/review';

const reviewsController = {
  create(req, res) {
    const Review = {
      id: Reviews.length + 1,
      response: req.body.response,
      userId: req.body.userId,
      businessId: req.params.businessId,
    };

    if (!req.body.response || !req.body.userId || !req.body.businessId) {
      return res.status(206).json({ message: 'Incomplete field', error: true });
    }

    Reviews.push(Review);
    return res.status(201).json({ Reviews: Review, message: 'Success', error: false });
  },
  retrieve(req, res) {
    const array = [];
    for (const Review of Reviews) {
      if (Review.businessId === req.params.businessId) {
        array.push(Review);
      }
    }
    return res.json({ Reviews: array, message: 'Success', error: false });
  }

};

export default reviewsController;
