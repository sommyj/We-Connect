'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fileSystem = require('file-system');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = [_models2.default.User, _models2.default.Business],
    User = _ref[0],
    Business = _ref[1];


var upload = (0, _multer2.default)({
  dest: './usersUploads/'
});

var fileSizeLimit = 1024 * 1024 * 2;

/**
 * rename file to an appropriate name
 * @param {String} tempPath The temporary path name.
 * @param {String} targetPath The target path name.
 * @returns {void} nothing.
 */
var renameFile = function renameFile(tempPath, targetPath) {
  _fileSystem2.default.rename(tempPath, targetPath, function (err) {
    if (err) throw err;
  });
};

/**
 * delete a file
 * @param {String} targetPath The part to delete from
 * @returns {void} nothing.
 */
var deleteFile = function deleteFile(targetPath) {
  _fileSystem2.default.unlink(targetPath, function (err) {
    if (err) throw err;
  });
};

// file type handleError
var fileTypeHandleError = function fileTypeHandleError(res) {
  res.status(403).json({ message: 'Only .png and .jpg files are allowed!', error: true });
};

// file size handleError
var fileSizeHandleError = function fileSizeHandleError(res) {
  res.status(403).json({ message: 'file should not be more than 2mb!', error: true });
};

// Token creation hanlder method
var tokenMethod = function tokenMethod(userId) {
  var token = _jsonwebtoken2.default.sign({ id: userId }, _app2.default.get('superSecret'), { expiresIn: 86400 // expires in 24 hours
  });
  return token;
};

/* File filter handle method */
var fileFilterMethod = function fileFilterMethod(req) {
  var fileErrorArray = [];
  var fileSizeError = false;
  var fileTypeError = false;
  var filePath = '';

  if (req.file) {
    var tempPath = './' + req.file.path;
    var targetPath = './usersUploads/' + (new Date().toISOString() + req.file.originalname);
    if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
      if (req.file.size <= fileSizeLimit) {
        renameFile(tempPath, targetPath);
        // remove the dot in targetPath
        filePath = targetPath.substring(1, targetPath.length);
      } else {
        deleteFile(tempPath);
        fileSizeError = true;
      }
    } else {
      deleteFile(tempPath);
      fileTypeError = true;
    }
  }
  fileErrorArray[0] = fileSizeError;
  fileErrorArray[1] = fileTypeError;
  fileErrorArray[2] = filePath;

  return fileErrorArray;
};

var usersController = {
  upload: upload.single('userImage'), // image upload
  // create a user
  create: function create(req, res) {
    // implementing the file filter method
    var fileFilterValues = fileFilterMethod(req, res);
    var fileSizeError = fileFilterValues[0];
    var fileTypeError = fileFilterValues[1];
    var filePath = fileFilterValues[2];

    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);

    /* Required feilds */
    if (!req.body.title || !req.body.firstname || !req.body.lastname || !req.body.username || !req.body.password || !req.body.email || !req.body.gender || !req.body.dob || !req.body.phone) {
      if (filePath) {
        deleteFile('./' + filePath);
      }
      return res.status(206).send({ message: 'Incomplete field' });
    }

    var hashedPassword = _bcryptjs2.default.hashSync(req.body.password, 8);

    return User.create({
      title: req.body.title,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      gender: req.body.gender,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      dob: req.body.dob,
      phone: req.body.phone,
      userImage: filePath
    }).then(function (user) {
      var token = tokenMethod(user.id); // Generate token
      if (token) return res.status(201).send({ user: user, auth: true, token: token });
    }).catch(function (error) {
      if (filePath) deleteFile('./' + filePath);
      return res.status(400).send(error);
    });
  },

  // login with username and password
  check: function check(req, res) {
    return User.findOne({ where: { username: req.body.username, password: req.body.password } }).then(function (user) {
      if (!user) return res.status(404).send({ message: 'User not found' });
      var token = tokenMethod(user.id); // Generate token
      if (token) return res.status(200).send({ user: user, auth: true, token: token });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  list: function list(req, res) {
    return User.findAll({
      include: [{ model: Business, as: 'businesses' }]
    }).then(function (users) {
      return res.status(200).send(users);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },

  // update user
  update: function update(req, res) {
    // implementing the file filter method
    var fileFilterValues = fileFilterMethod(req, res);
    var fileSizeError = fileFilterValues[0];
    var fileTypeError = fileFilterValues[1];
    var filePath = fileFilterValues[2];

    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);

    return User.findById(req.params.userId, {
      include: [{ model: Business, as: 'businesses' }]
    }).then(function (user) {
      if (!user) {
        // if file and url is not empty delete img for updation
        if (filePath) deleteFile('./' + filePath);
        return res.status(404).send({ message: 'User not found' });
      }
      // holds the url of the image before update in other not to loose it
      var previousImage = user.userImage;
      return user.update({
        title: req.body.title || user.title,
        firstname: req.body.firstname || user.firstname,
        lastname: req.body.lastname || user.lastname,
        username: req.body.username || user.username,
        password: req.body.password || user.password,
        email: req.body.email || user.email,
        gender: req.body.gender || user.gender,
        street: req.body.street || user.street,
        city: req.body.city || user.city,
        state: req.body.state || user.state,
        country: req.body.country || user.country,
        dob: req.body.dob || user.dob,
        phone: req.body.phone || user.phone,
        userImage: filePath || user.userImage
      }).then(function (userUpdate) {
        // if file and url is not empty delete img for updation
        if (filePath) {
          if (previousImage) deleteFile('./' + previousImage);
        }
        return res.status(200).send(userUpdate);
      }) // Send back the updated user
      .catch(function (error) {
        if (filePath) deleteFile('./' + filePath);
        return res.status(400).send(error);
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },

  // delete user
  destroy: function destroy(req, res) {
    return User.findById(req.params.userId).then(function (user) {
      if (!user) return res.status(404).send({ message: 'User not found' });

      return user.destroy().then(function () {
        if (user.userImage) deleteFile('./' + user.userImage);
        return res.status(204).send();
      }).catch(function (error) {
        return res.status(400).send(error);
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },

  // get a user
  retrieve: function retrieve(req, res) {
    return User.findById(req.params.userId, {
      include: [{ model: Business, as: 'businesses' }]
    }).then(function (user) {
      if (!user) return res.status(404).send({ message: 'User not found' });
      return res.status(200).send(user);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
};

exports.default = usersController;