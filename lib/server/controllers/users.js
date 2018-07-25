'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fileSystem = require('file-system');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileFilter = function fileFilter(req, file, cb) {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('File should be jpeg or png'), false);
  }
};

var upload = (0, _multer2.default)({
  dest: './usersUploads/',
  // storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

var handleError = function handleError(err, res) {
  res.status(500).contentType('text/plain').end('Oops! Something went wrong!');
};

var usersController = {
  // image upload
  upload: upload.single('userImage'),
  // create a user
  create: function create(req, res) {
    var filePath = '';
    if (req.file) {
      var tempPath = req.file.path;
      var targetPath = './usersUploads/' + (new Date().toISOString() + req.file.originalname);

      // rename file to an appropriate name
      _fileSystem2.default.rename(tempPath, targetPath, function (err) {
        if (err) return handleError(err, res);
      });

      filePath = targetPath.substring(0, targetPath.length);
    }

    var User = {
      id: _user2.default.length + 1,
      title: req.body.title ? req.body.title.trim() : req.body.title,
      firstname: req.body.firstname ? req.body.firstname.trim() : req.body.firstname,
      lastname: req.body.lastname ? req.body.lastname.trim() : req.body.lastname,
      username: req.body.username ? req.body.username.trim() : req.body.username,
      password: req.body.password ? req.body.password.trim() : req.body.password,
      email: req.body.email ? req.body.email.trim() : req.body.email,
      gender: req.body.gender ? req.body.gender.trim() : req.body.gender,
      street: req.body.street ? req.body.street.trim() : req.body.street,
      city: req.body.city ? req.body.city.trim() : req.body.city,
      state: req.body.state ? req.body.state.trim() : req.body.state,
      dob: req.body.date,
      registered: new Date(),
      phone: req.body.phone ? req.body.phone.trim() : req.body.phone,
      userImage: filePath
    };

    // image to be saved
    var picture = filePath;

    if (!req.body.title || !req.body.firstname || !req.body.lastname || !req.body.username || !req.body.password || !req.body.email || !req.body.gender || !req.body.dob || !req.body.phone) {
      if (picture) {
        _fileSystem2.default.unlink('./' + picture, function (err) {
          if (err) return handleError(err, res);
        });
      }
      return res.status(206).json({ message: 'Incomplete field', error: true });
    }

    // Users.push(req.body);
    _user2.default.push(User);
    return res.status(201).json({ Users: User, message: 'Success', error: false });
  },

  // login with username and password
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

  // update user
  update: function update(req, res) {
    var filePath = '';
    if (req.file) {
      var tempPath = req.file.path;
      var targetPath = './usersUploads/' + (new Date().toISOString() + req.file.originalname);

      // rename file to an appropriate name
      _fileSystem2.default.rename(tempPath, targetPath, function (err) {
        if (err) return handleError(err, res);
      });

      filePath = targetPath.substring(0, targetPath.length);
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _user2.default[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var User = _step2.value;

        if (User.id === parseInt(req.params.userId, 10)) {
          // holds the url of the image before update in other not to loose it
          var picture = User.userImage;

          User.title = req.body.title;
          User.firstname = req.body.firstname ? req.body.firstname.trim() : User.firstname;
          User.lastname = req.body.lastname ? req.body.lastname.trim() : User.lastname;
          User.username = req.body.username ? req.body.username.trim() : User.username;
          User.password = req.body.password ? req.body.password.trim() : User.password;
          User.email = req.body.email ? req.body.email.trim() : User.email;
          User.gender = req.body.gender;
          User.street = req.body.street ? req.body.street.trim() : User.street;
          User.city = req.body.city ? req.body.city.trim() : User.city;
          User.state = req.body.state ? req.body.state.trim() : User.state;
          User.dob = req.body.dob ? req.body.dob.trim() : User.dob;
          User.phone = req.body.phone ? req.body.phone.trim() : User.phone;

          // if file and url is not empty delete img for updation
          if (req.file) {
            if (User.userImage.trim()) {
              _fileSystem2.default.unlink('./' + User.userImage, function (err) {
                if (err) return handleError(err, res);
              });
            }
          }
          User.userImage = req.file ? filePath : picture;

          return res.json({ Users: User, message: 'User updated!', error: false });
        }
      }

      // remove file if id is not available
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

    if (req.file) {
      _fileSystem2.default.unlink('./' + filePath, function (err) {
        if (err) return handleError(err, res);
      });
    }
    return res.status(404).json({ message: 'User not found', error: true });
  },

  // delete user
  destroy: function destroy(req, res) {
    var i = 0;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = _user2.default[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var User = _step3.value;

        if (User.id === parseInt(req.params.userId, 10)) {
          if (User.userImage.trim()) {
            _fileSystem2.default.unlink('./' + User.userImage, function (err) {
              if (err) return handleError(err, res);
            });
          }
          _user2.default.splice(i, 1);
          return res.status(204).json({ Users: _user2.default, message: 'User deleted!', error: false });
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

  // get a user
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