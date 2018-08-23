import multer from 'multer';
import fs from 'file-system';
import jwt from 'jsonwebtoken';
import model from '../models';
import app from '../../app';

const [Business, Review] = [model.Business, model.Review];

const upload = multer({
  dest: './businessesUploads/'
});

const fileSizeLimit = 1024 * 1024 * 2;

/**
 * rename file to an appropriate name
 * @param {String} tempPath The temporary path name.
 * @param {String} targetPath The target path name.
 * @returns {void} nothing.
 */
const renameFile = (tempPath, targetPath) => {
  fs.rename(tempPath, targetPath, (err) => {
    if (err) throw err;
  });
};

/**
 * delete a file
 * @param {String} targetPath The part to delete from
 * @returns {void} nothing.
 */
const deleteFile = (targetPath) => {
  fs.unlink(targetPath, (err) => {
    if (err) throw err;
  });
};

// file type handleError
const fileTypeHandleError = (res) => {
  res.status(403).json({ message: 'Only .png and .jpg files are allowed!', error: true });
};

// file size handleError
const fileSizeHandleError = (res) => {
  res.status(403).json({ message: 'file should not be more than 2mb!', error: true });
};

/* File filter handle method */
const fileFilterMethod = (req) => {
  const fileErrorArray = [];
  let fileSizeError = false;
  let fileTypeError = false;
  let filePath = '';

  if (req.file) {
    const tempPath = `./${req.file.path}`;
    const targetPath = `./businessesUploads/${new Date().toISOString() + req.file.originalname}`;
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
const authMethod = (req) => {
  const authMethodArray = [];
  let noTokenProviderError = false;
  let failedAuth = false;
  let decodedID;

  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    if (req.file) deleteFile(`./${req.file.path}`);
    noTokenProviderError = true;
  }

  // verifies secret and checks exp
  jwt.verify(token, app.get('superSecret'), (err, decoded) => {
    if (err) {
      if (!noTokenProviderError) {
        if (req.file) deleteFile(`./${req.file.path}`);
        failedAuth = true;
      }
    } else decodedID = decoded.id;
  });

  authMethodArray[0] = noTokenProviderError;
  authMethodArray[1] = failedAuth;
  authMethodArray[2] = decodedID;

  return authMethodArray;
};

const businessesController = {
  // image upload
  upload: upload.single('companyImage'),
  // create a business
  create(req, res) {
    let decodedID;
    const authValues = authMethod(req, res);
    const noTokenProviderError = authValues[0];
    const failedAuthError = authValues[1];
    const decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return res.status(401).send({ auth: false, message: 'No token provided.' });

    if (failedAuthError) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    let filePath = '';
    // implementing the file filter method
    const fileFilterValues = fileFilterMethod(req, res);
    const fileSizeError = fileFilterValues[0];
    const fileTypeError = fileFilterValues[1];
    if(fileFilterValues[2]) filePath = fileFilterValues[2];

    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);

    /* Required feilds */
    if (!req.body.businessName || !req.body.description ||
      !req.body.email || !req.body.phone || !req.body.category) {
      if (filePath) { deleteFile(`./${filePath}`); }
      return res.status(206).send({ message: 'Incomplete fields' });
    }

    return Business
      .create({
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
        userId: decodedID,
      })
      .then(business => res.status(201).send(business))
      .catch((error) => {
        if (filePath) { deleteFile(`./${filePath}`); }
        return res.status(400).send(error);
      });
  },
  // update business
  update(req, res) {
    let decodedID;

    // implementing the file authentication method
    const authValues = authMethod(req, res);
    const noTokenProviderError = authValues[0];
    const failedAuthError = authValues[1];
    const decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return res.status(401).send({ auth: false, message: 'No token provided.' });
    if (failedAuthError) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    let filePath = '';
    // implementing the file filter method
    const fileFilterValues = fileFilterMethod(req, res);
    const fileSizeError = fileFilterValues[0];
    const fileTypeError = fileFilterValues[1];
    if(fileFilterValues[2]) filePath = fileFilterValues[2];

    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);

    return Business
      .findById(req.params.businessId, {
        include: [{ model: Review, as: 'reviews' }]
      })
      .then((business) => {
        if (!business) {
          // if file and url is not empty delete img for updation
          if (filePath) { deleteFile(`./${filePath}`); }
          return res.status(404).send({ message: 'Business not found' });
        }

        // Compare user id
        if (decodedID !== business.userId) {
          if (filePath) deleteFile(`./${filePath}`);
          return res.status(403).send({ auth: false, message: 'User not allowed' });
        }


        // holds the url of the image before update in other not to loose it
        const previousImage = business.companyImage;

        return business
          .update({
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
            userId: business.userId,
          }).then((businessForUpdate) => {
            // if file and url is not empty delete img for updation
            if (filePath) {
              if (previousImage) {
                deleteFile(`./${previousImage}`);
              }
            }
            return res.status(200).send(businessForUpdate);
          }).catch((error) => {
            if (filePath) { deleteFile(`./${filePath}`); }
            return res.status(400).send(error);
          });
      }).catch(error => res.status(400).send(error));
  },
  // delete business
  destroy(req, res) {
    let decodedID;
    const authValues = authMethod(req, res);
    const noTokenProviderError = authValues[0];
    const failedAuthError = authValues[1];
    const decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return res.status(401).send({ auth: false, message: 'No token provided.' });

    if (failedAuthError) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    return Business
      .findById(req.params.businessId)
      .then((business) => {
        if (!business) {
          return res.status(404).send({ message: 'Business not found' });
        }

        if (decodedID !== business.userId) { return res.status(403).send({ auth: false, message: 'User not allowed' }); }

        return business
          .destroy()
          .then(() => {
            if (business.companyImage) {
              deleteFile(`./${business.companyImage}`);
            }
            return res.status(204).send();
          }).catch(error => res.status(400).send(error));
      }).catch(error => res.status(400).send(error));
  },
  // get a business
  retrieve(req, res) {
    return Business
      .findById(req.params.businessId, {
        include: [{ model: Review, as: 'reviews' }]
      })
      .then((business) => {
        if (!business) {
          return res.status(404).send({ message: 'Business not found' });
        }
        return res.status(200).send(business);
      }).catch(error => res.status(400).send(error));
  },
  // get businesses
  list(req, res) {
    let selectionType;
    if (!req.query.location && !req.query.category) {
      selectionType = Business
        .findAll({ include: [{ model: Review, as: 'reviews' }] });
    }
    if (req.query.location && !req.query.category) {
      selectionType = Business
        .findAll({
          where: { country: req.query.location },
          include: [{ model: Review, as: 'reviews' }]
        });
    }
    if (!req.query.location && req.query.category) {
      selectionType = Business
        .findAll({
          where: { category: req.query.category },
          include: [{ model: Review, as: 'reviews' }]
        });
    }
    if (req.query.location && req.query.category) {
      selectionType = Business
        .findAll({
          where: { country: req.query.location, category: req.query.category },
          include: [{ model: Review, as: 'reviews' }]
        });
    }
    return selectionType
      .then((business) => {
        if (business.length === 0) {
          return res.status(404).send({ message: 'Businesses not found' });
        }
        return res.status(200).send(business);
      }).catch(error => res.status(400).send(error));
  },
};

export default businessesController;
