// import user from '../models/user';
const user = require('../models/user');

module.exports = {
  create(req, res) {
    if (!req.body.name || !req.body.username || !req.body.email || !req.body.password) {
      return res.status(206).json({
        message: 'Incomplete field',
        error: true
      });
    }
    user.push(req.body);
    return res.json({
      user,
      message: 'Success',
      error: false
    });
  },
  check(req, res) {
    for (let i = 0; i < user.length; i += 1) {
      if (user[i].username === req.body.username &&
        user[i].password === req.body.password) {
        return res.json({
          user: user[i],
          message: 'Success',
          error: false
        });
      }
    }
    return res.status(404).json({
      message: 'User not found',
      error: true
    });
  },
  list(req, res) {
    return res.json({
      user,
      error: false
    });
  },
  update(req, res) {
    for (let i = 0; i < user.length; i += 1) {
      if (user[i].id === parseInt(req.params.userId, 10)) {
        user[i].name = req.body.name;
        user[i].username = req.body.username;
        user[i].email = req.body.email;
        user[i].password = req.body.password;
        return res.json({
          user: user[i],
          message: 'User updated!',
          error: false
        });
      }
    }
    return res.status(404).json({
      message: 'User not found',
      error: true
    });
  },
  destroy(req, res) {
    for (let i = 0; i < user.length; i += 1) {
      if (user[i].id === parseInt(req.params.userId, 10)) {
        user.splice(i, 1);
        return res.json({
          message: 'User deleted!',
          error: false
        });
      }
    }
    return res.status(404).json({
      message: 'User not found',
      error: true
    });
  },
  retrieve(req, res) {
    for (let i = 0; i < user.length; i += 1) {
      if (user[i].id === parseInt(req.params.userId, 10)) {
        return res.json({
          user: user[i],
          message: 'Success',
          error: false
        });
      }
    }
    return res.status(404).json({
      message: 'User not found',
      error: true
    });
  },
};
