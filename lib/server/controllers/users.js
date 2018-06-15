'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usersController = {
  create: function create(req, res) {
    if (!req.body.name || !req.body.username || !req.body.email || !req.body.password) {
      return res.status(206).json({ message: 'Incomplete field', error: true });
    }
    _user2.default.push(req.body);
    return res.json({ Users: _user2.default, message: 'Success', error: false });
  },
  check: function check(req, res) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _user2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var User = _step.value;

        if (User.username === req.body.username && User.password === req.body.password) {
          return res.json({ Users: User, message: 'Success', error: false });
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

    return res.status(404).json({ message: 'User not found', error: true });
  },
  list: function list(req, res) {
    return res.json({ Users: _user2.default, error: false });
  },
  update: function update(req, res) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _user2.default[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var User = _step2.value;

        if (User.id === parseInt(req.params.userId, 10)) {
          User.name = req.body.name;
          User.username = req.body.username;
          User.email = req.body.email;
          User.password = req.body.password;
          return res.json({ Users: User, message: 'User updated!', error: false });
        }
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

    return res.status(404).json({ message: 'User not found', error: true });
  },
  destroy: function destroy(req, res) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = _user2.default[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var User = _step3.value;

        var i = 0;
        if (User.id === parseInt(req.params.userId, 10)) {
          _user2.default.splice(i, 1);
          return res.json({ message: 'User deleted!', error: false });
        }
        i += 1;
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

    return res.status(404).json({ message: 'User not found', error: true });
  },
  retrieve: function retrieve(req, res) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = _user2.default[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var User = _step4.value;

        if (User.id === parseInt(req.params.userId, 10)) {
          return res.json({ Users: User, message: 'Success', error: false });
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

    return res.status(404).json({ message: 'User not found', error: true });
  }
};

exports.default = usersController;