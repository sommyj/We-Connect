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
    _user2.default.forEach(function (User) {
      if (User.username === req.body.username && User.password === req.body.password) {
        return res.json({ Users: User, message: 'Success', error: false });
      }
    });
    return res.status(404).json({ message: 'User not found', error: true });
  },
  list: function list(req, res) {
    return res.json({ Users: _user2.default, error: false });
  },
  update: function update(req, res) {
    _user2.default.forEach(function (User) {
      if (User.id === parseInt(req.params.userId, 10)) {
        User.name = req.body.name;
        User.username = req.body.username;
        User.email = req.body.email;
        User.password = req.body.password;
        return res.json({ Users: User, message: 'User updated!', error: false });
      }
    });
    return res.status(404).json({ message: 'User not found', error: true });
  },
  destroy: function destroy(req, res) {
    _user2.default.forEach(function (User) {
      var i = 0;
      if (User.id === parseInt(req.params.userId, 10)) {
        _user2.default.splice(i, 1);
        return res.json({ message: 'User deleted!', error: false });
      }
      i += 1;
    });
    return res.status(404).json({ message: 'User not found', error: true });
  },
  retrieve: function retrieve(req, res) {
    _user2.default.forEach(function (User) {
      if (User.id === parseInt(req.params.userId, 10)) {
        return res.json({ Users: User, message: 'Success', error: false });
      }
    });
    return res.status(404).json({ message: 'User not found', error: true });
  }
};

exports.default = usersController;