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

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = [_models2.default.Business, _models2.default.Review],
    Business = _ref[0],
    Review = _ref[1];


var upload = (0, _multer2.default)({
  dest: './businessesUploads/'
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

/* File filter handle method */
var fileFilterMethod = function fileFilterMethod(req) {
  var fileErrorArray = [];
  var fileSizeError = false;
  var fileTypeError = false;
  var filePath = '';

  if (req.file) {
    var tempPath = './' + req.file.path;
    var targetPath = './businessesUploads/' + (new Date().toISOString() + req.file.originalname);
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

/* Authentication handle method */
var authMethod = function authMethod(req) {
  var authMethodArray = [];
  var noTokenProviderError = false;
  var failedAuth = false;
  var decodedID = void 0;

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    if (req.file) deleteFile('./' + req.file.path);
    noTokenProviderError = true;
  }

  // verifies secret and checks exp
  _jsonwebtoken2.default.verify(token, _app2.default.get('superSecret'), function (err, decoded) {
    if (err) {
      if (!noTokenProviderError) {
        if (req.file) deleteFile('./' + req.file.path);
        failedAuth = true;
      }
    } else decodedID = decoded.id;
  });

  authMethodArray[0] = noTokenProviderError;
  authMethodArray[1] = failedAuth;
  authMethodArray[2] = decodedID;

  return authMethodArray;
};

var businessesController = {
  // image upload
  upload: upload.single('companyImage'),
  // create a business
  create: function create(req, res) {
    var decodedID = void 0;
    var authValues = authMethod(req, res);
    var noTokenProviderError = authValues[0];
    var failedAuthError = authValues[1];
    var decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return res.status(401).send({ auth: false, message: 'No token provided.' });

    if (failedAuthError) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    // implementing the file filter method
    var fileFilterValues = fileFilterMethod(req, res);
    var fileSizeError = fileFilterValues[0];
    var fileTypeError = fileFilterValues[1];
    var filePath = fileFilterValues[2];

    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);

    /* Required feilds */
    if (!req.body.businessName || !req.body.description || !req.body.email || !req.body.phone || !req.body.category) {
      if (filePath) {
        deleteFile('./' + filePath);
      }
      return res.status(206).send({ message: 'Incomplete fields' });
    }

    return Business.create({
      businessName: req.body.businessName,
      description: req.body.description,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      datefound: req.body.datefound,
      email: req.body.email,
      phone: req.body.phone,
      category: req.body.category,
      companyImage: filePath,
      userId: decodedID
    }).then(function (business) {
      return res.status(201).send(business);
    }).catch(function (error) {
      if (filePath) {
        deleteFile('./' + filePath);
      }
      return res.status(400).send(error);
    });
  },

  // update business
  update: function update(req, res) {
    var decodedID = void 0;

    // implementing the file authentication method
    var authValues = authMethod(req, res);
    var noTokenProviderError = authValues[0];
    var failedAuthError = authValues[1];
    var decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return res.status(401).send({ auth: false, message: 'No token provided.' });
    if (failedAuthError) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    // implementing the file filter method
    var fileFilterValues = fileFilterMethod(req, res);
    var fileSizeError = fileFilterValues[0];
    var fileTypeError = fileFilterValues[1];
    var filePath = fileFilterValues[2];

    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);

    return Business.findById(req.params.businessId, {
      include: [{ model: Review, as: 'reviews' }]
    }).then(function (business) {
      if (!business) {
        // if file and url is not empty delete img for updation
        if (filePath) {
          deleteFile('./' + filePath);
        }
        return res.status(404).send({ message: 'Business not found' });
      }

      // Compare user id
      if (decodedID !== business.userId) {
        if (filePath) deleteFile('./' + filePath);
        return res.status(403).send({ auth: false, message: 'User not allowed' });
      }

      // holds the url of the image before update in other not to loose it
      var previousImage = business.companyImage;

      return business.update({
        businessName: req.body.businessName || business.businessName,
        description: req.body.description || business.description,
        street: req.body.street || business.street,
        city: req.body.city || business.city,
        state: req.body.state || business.state,
        country: req.body.country || business.country,
        datefound: req.body.datefound || business.datefound,
        email: req.body.email || business.email,
        phone: req.body.phone || business.phone,
        category: req.body.category || business.category,
        companyImage: filePath || business.companyImage,
        userId: business.userId
      }).then(function (businessForUpdate) {
        // if file and url is not empty delete img for updation
        if (filePath) {
          if (previousImage) {
            deleteFile('./' + previousImage);
          }
        }
        return res.status(200).send(businessForUpdate);
      }).catch(function (error) {
        if (filePath) {
          deleteFile('./' + filePath);
        }
        return res.status(400).send(error);
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },

  // delete business
  destroy: function destroy(req, res) {
    var decodedID = void 0;
    var authValues = authMethod(req, res);
    var noTokenProviderError = authValues[0];
    var failedAuthError = authValues[1];
    var decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return res.status(401).send({ auth: false, message: 'No token provided.' });

    if (failedAuthError) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    return Business.findById(req.params.businessId).then(function (business) {
      if (!business) {
        return res.status(404).send({ message: 'Business not found' });
      }

      if (decodedID !== business.userId) {
        return res.status(403).send({ auth: false, message: 'User not allowed' });
      }

      return business.destroy().then(function () {
        if (business.companyImage) {
          deleteFile('./' + business.companyImage);
        }
        return res.status(204).send();
      }).catch(function (error) {
        return res.status(400).send(error);
      });
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },

  // get a business
  retrieve: function retrieve(req, res) {
    return Business.findById(req.params.businessId, {
      include: [{ model: Review, as: 'reviews' }]
    }).then(function (business) {
      if (!business) {
        return res.status(404).send({ message: 'Business not found' });
      }
      return res.status(200).send(business);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  },

  // get businesses
  list: function list(req, res) {
    var selectionType = void 0;
    if (!req.query.location && !req.query.category) {
      selectionType = Business.findAll({ include: [{ model: Review, as: 'reviews' }] });
    }
    if (req.query.location && !req.query.category) {
      selectionType = Business.findAll({
        where: { country: req.query.location },
        include: [{ model: Review, as: 'reviews' }]
      });
    }
    if (!req.query.location && req.query.category) {
      selectionType = Business.findAll({
        where: { category: req.query.category },
        include: [{ model: Review, as: 'reviews' }]
      });
    }
    if (req.query.location && req.query.category) {
      selectionType = Business.findAll({
        where: { country: req.query.location, category: req.query.category },
        include: [{ model: Review, as: 'reviews' }]
      });
    }
    return selectionType.then(function (business) {
      if (business.length === 0) {
        return res.status(404).send({ message: 'Businesses not found' });
      }
      return res.status(200).send(business);
    }).catch(function (error) {
      return res.status(400).send(error);
    });
  }
};

exports.default = businessesController;