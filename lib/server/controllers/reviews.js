'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Review = _models2.default.Review;

var reviewsController = {
  create: function create(req, res) {

    if (!req.body.response || !req.body.userId || !req.body.businessId) {
      return res.status(206).send({ message: 'Incomplete field' });
    }

    return Review.create({
      response: req.body.response,
      userId: req.body.userId,
      businessId: req.params.businessId
    }).then(function (review) {
      return res.status(201).send(review);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  list: function list(req, res) {
    return Review.findAll({ where: { businessId: req.params.businessId } }).then(function (reviews) {
      return res.status(200).send(reviews);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  update: function update(req, res) {
    return Review.findById(req.params.reviewId).then(function (review) {
      if (!review) {
        return res.status(404).send({ message: 'Review not found' });
      }
      if (review.userId != req.body.userId) {
        return res.status(400).send({ message: 'User can not be altered' });
      }
      if (review.businessId != req.body.businessId) {
        return res.status(400).send({ message: 'Business can not be altered' });
      }
      return review.update({
        response: req.body.response || review.response,
        userId: req.body.userId || review.userId,
        businessId: req.params.businessId
      }).then(function (review) {
        return res.status(200).send(review);
      }).catch(function (error) {
        return res.status(400).send(error);
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  destroy: function destroy(req, res) {
    return Review.findById(req.params.reviewId).then(function (review) {
      if (!review) {
        return res.status(404).send({ message: 'Review not found' });
      }
      return review.destroy().then(function () {
        return res.status(204).send();
      }).catch(function (error) {
        return res.status(400).send(error);
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
};

exports.default = reviewsController;