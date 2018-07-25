

Object.defineProperty(exports, '__esModule', {
  value: true
});

const _review = require('../models/review');

const _review2 = _interopRequireDefault(_review);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reviewsController = {
  create: function create(req, res) {
    const Review = {
      id: _review2.default.length + 1,
      response: req.body.response,
      userId: req.body.userId,
      businessId: req.params.businessId
    };

    if (!req.body.response || !req.body.userId || !req.body.businessId) {
      return res.status(206).json({ message: 'Incomplete field', error: true });
    }

    _review2.default.push(Review);
    return res.status(201).json({ Reviews: Review, message: 'Success', error: false });
  },
  retrieve: function retrieve(req, res) {
    const array = [];
    let _iteratorNormalCompletion = true;
    let _didIteratorError = false;
    let _iteratorError;

    try {
      for (var _iterator = _review2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const Review = _step.value;

        if (Review.businessId === req.params.businessId) {
          array.push(Review);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return res.json({ Reviews: array, message: 'Success', error: false });
  }
};

exports.default = reviewsController;
