'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _business = require('../models/business');

var _business2 = _interopRequireDefault(_business);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var businessesController = {
  create: function create(req, res) {
    if (!req.body.businessName || !req.body.reviews || !req.body.location || !req.body.category) {
      return res.status(206).json({
        message: 'Incomplete fields',
        error: true
      });
    }
    _business2.default.push(req.body);
    return res.json({
      Businesses: _business2.default,
      message: 'Success',
      error: false
    });
  },
  update: function update(req, res) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _business2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var Business = _step.value;

        if (Business.businessId === req.params.businessId) {
          Business.businessName = req.body.businessName;
          Business.userId = req.body.userId;
          Business.reviews = req.body.reviews;
          Business.location = req.body.location;
          Business.category = req.body.category;

          return res.json({
            Businesses: Business,
            message: 'Bussiness updated!',
            error: false
          });
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

    return res.status(404).json({
      message: 'Business not found',
      error: true
    });
  },
  destroy: function destroy(req, res) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _business2.default[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var Business = _step2.value;

        var i = 0;
        if (Business.businessId === req.params.businessId) {
          _business2.default.splice(i, 1);

          return res.status(404).json({
            Businesses: _business2.default,
            message: 'Business successfully deleted!',
            error: false
          });
        }
        i++;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return res.status(404).json({
      message: 'Business not found',
      error: true
    });
  },
  retrieve: function retrieve(req, res) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = _business2.default[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var Business = _step3.value;

        if (Business.businessId === req.params.businessId) {
          return res.json({
            Businesses: Business,
            error: false
          });
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return res.status(404).json({
      message: 'Business not found',
      error: true
    });
  },
  list: function list(req, res) {
    if (!req.query.location && !req.query.category) {
      return res.json({
        Businesses: _business2.default,
        error: false
      });
    }
    if (req.query.location && !req.query.category) {
      var array = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _business2.default[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var Business = _step4.value;

          if (Business.location === req.query.location) {
            array.push(Business);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (array.length !== 0) {
        return res.json({
          Businesses: array,
          error: false
        });
      }
    }
    if (req.query.category && !req.query.location) {
      var _array = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = _business2.default[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _Business = _step5.value;

          if (_Business.category === req.query.category) {
            _array.push(_Business);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      if (_array.length !== 0) {
        return res.json({
          Businesses: _array,
          error: false
        });
      }
    }
    if (req.query.location && req.query.category) {
      var _array2 = [];
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = _business2.default[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _Business2 = _step6.value;

          if (_Business2.location === req.query.location && _Business2.category === req.query.category) {
            _array2.push(_Business2);
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      if (_array2.length !== 0) {
        return res.json({
          Businesses: _array2,
          error: false
        });
      }
    }
    return res.status(404).json({
      message: 'Business not found',
      error: true
    });
  }
};

exports.default = businessesController;