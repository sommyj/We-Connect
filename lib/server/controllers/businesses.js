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
      return res.status(206).json({ message: 'Incomplete fields', error: true });
    }
    _business2.default.push(req.body);
    return res.json({ Businesses: _business2.default, message: 'Success', error: false });
  },
  update: function update(req, res) {
    _business2.default.forEach(function (Business) {
      if (Business.businessId === req.params.businessId) {
        Business.businessName = req.body.businessName;
        Business.userId = req.body.userId;
        Business.reviews = req.body.reviews;
        Business.location = req.body.location;
        Business.category = req.body.category;

        return res.json({ Businesses: Business, message: 'Bussiness updated!', error: false });
      }
    });
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  destroy: function destroy(req, res) {
    _business2.default.forEach(function (Business) {
      var i = 0;
      if (Business.businessId === req.params.businessId) {
        _business2.default.splice(i, 1);
        return res.status(404).json({ Businesses: _business2.default, message: 'Business successfully deleted!', error: false });
      }
      i += 1;
    });
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  retrieve: function retrieve(req, res) {
    _business2.default.forEach(function (Business) {
      if (Business.businessId === req.params.businessId) {
        return res.json({ Businesses: Business, error: false });
      }
    });
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  list: function list(req, res) {
    if (!req.query.location && !req.query.category) {
      return res.json({ Businesses: _business2.default, error: false });
    }
    if (req.query.location && !req.query.category) {
      var array = [];
      _business2.default.forEach(function (Business) {
        if (Business.location === req.query.location) {
          array.push(Business);
        }
      });
      if (array.length !== 0) {
        return res.json({ Businesses: array, error: false });
      }
    }
    if (req.query.category && !req.query.location) {
      var _array = [];
      _business2.default.forEach(function (Business) {
        if (Business.category === req.query.category) {
          _array.push(Business);
        }
      });
      if (_array.length !== 0) {
        return res.json({ Businesses: _array, error: false });
      }
    }
    if (req.query.location && req.query.category) {
      var _array2 = [];
      _business2.default.forEach(function (Business) {
        if (Business.location === req.query.location && Business.category === req.query.category) {
          _array2.push(Business);
        }
      });
      if (_array2.length !== 0) {
        return res.json({ Businesses: _array2, error: false });
      }
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  }
};

exports.default = businessesController;