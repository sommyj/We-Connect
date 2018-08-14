import model from '../models';

const Review = model.Review;

const reviewsController = {
  create(req, res) {

    if (!req.body.response || !req.body.userId || !req.body.businessId) {
      return res.status(206).send({message: 'Incomplete field'});
    }

    return Review
      .create({
        response: req.body.response,
        userId: req.body.userId,
        businessId: req.params.businessId,
      })
      .then(review => res.status(201).send(review))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Review
      .findAll({where: {businessId: req.params.businessId}})
      .then(reviews => res.status(200).send(reviews))
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return Review
      .findById(req.params.reviewId)
      .then(review => {
        if(!review) {
          return res.status(404).send({message: 'Review not found'});
        }
        if(review.userId != req.body.userId) {
          return res.status(400).send({message: 'User can not be altered'});
        }
        if(review.businessId != req.body.businessId) {
          return res.status(400).send({message: 'Business can not be altered'});
        }
        return review
          .update({
            response: req.body.response || review.response,
            userId: req.body.userId || review.userId,
            businessId: req.params.businessId,
          })
          .then(review => res.status(200).send(review))
          .catch(error => res.status(400).send(error));
      }).catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    return Review
      .findById(req.params.reviewId)
      .then(review => {
        if(!review) {
          return res.status(404).send({message: 'Review not found'});
        }
        return review
          .destroy()
          .then(() => {return res.status(204).send()})
          .catch(error => res.status(400).send(error));
      }).catch(error => res.status(400).send(error));
  },

};

export default reviewsController;
