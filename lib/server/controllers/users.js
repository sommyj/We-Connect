'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fileSystem = require('file-system');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _models2.default.User;
var Business = _models2.default.Business;
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

var usersController = {
  // image upload
  upload: upload.single('userImage'),
  // create a user
  create: function create(req, res) {
    var filePath = '';
    if (req.file) {
      var tempPath = req.file.path;
      var targetPath = './usersUploads/' + (new Date().toISOString() + req.file.originalname);
      if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
        if (req.file.size <= fileSizeLimit) {
          renameFile(tempPath, targetPath);
          // remove the dot in targetPath
          filePath = targetPath.substring(1, targetPath.length);
        } else {
          deleteFile(tempPath);
          return fileSizeHandleError(res);
        }
      } else {
        deleteFile(tempPath);
        return fileTypeHandleError(res);
      }
    }

    if (!req.body.title || !req.body.firstname || !req.body.lastname || !req.body.username || !req.body.password || !req.body.email || !req.body.gender || !req.body.dob || !req.body.phone) {
      if (filePath) {
        deleteFile('./' + filePath);
      }
      return res.status(206).send({ message: 'Incomplete field' });
    }

    return User.create({
      title: req.body.title,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      gender: req.body.gender,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      dob: new Date(req.body.dob),
      phone: req.body.phone,
      userImage: filePath
    }).then(function (user) {
      return res.status(201).send(user);
    }).catch(function (error) {
      if (filePath) {
        deleteFile('./' + filePath);
      }
      return res.status(400).send(error);
    });
  },

  // login with username and password
  check: function check(req, res) {
    return User.findOne({ where: { username: req.body.username, password: req.body.password } }).then(function (user) {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },
  list: function list(req, res) {
    return User.findAll({
      include: [{
        model: Business,
        as: 'businesses'
      }]
    }).then(function (users) {
      return res.status(200).send(users);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },

  // update user
  update: function update(req, res) {
    var filePath = '';
    if (req.file) {
      var tempPath = req.file.path;
      var targetPath = './usersUploads/' + (new Date().toISOString() + req.file.originalname);

      if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
        if (req.file.size <= fileSizeLimit) {
          renameFile(tempPath, targetPath);
          // remove the dot in targetPath
          filePath = targetPath.substring(1, targetPath.length);
        } else {
          deleteFile(tempPath);
          return fileSizeHandleError(res);
        }
      } else {
        deleteFile(tempPath);
        return fileTypeHandleError(res);
      }
    }

    return User.findById(req.params.userId, {
      include: [{
        model: Business,
        as: 'businesses'
      }]
    }).then(function (user) {
      if (!user) {
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
        dob: new Date(req.body.dob) || user.dob,
        phone: req.body.phone || user.phone,
        userImage: filePath || user.userImage
      }).then(function (user) {
        // if file and url is not empty delete img for updation
        if (filePath) {
          if (previousImage) {
            deleteFile('./' + previousImage);
          }
        }
        return res.status(200).send(user);
      }) // Send back the updated user
      .catch(function (error) {
        if (filePath) {
          deleteFile('./' + filePath);
        }
        return res.status(400).send(error);
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },

  // delete user
  destroy: function destroy(req, res) {
    return User.findById(req.params.userId).then(function (user) {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      return user.destroy().then(function () {
        if (user.userImage) {
          deleteFile('./' + user.userImage);
        }
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
      include: [{
        model: Business,
        as: 'businesses'
      }]
    }).then(function (user) {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
};

exports.default = usersController;