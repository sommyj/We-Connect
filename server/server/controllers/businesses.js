import multer from 'multer';
import fs from 'file-system';
import Businesses from '../models/business';

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

const businessesController = {
  // image upload
  upload: upload.single('companyImage'),
  // create a business
  create(req, res) {
    let filePath = '';
    if (req.file) {
      const tempPath = req.file.path;
      const targetPath = `./businessesUploads/${new Date().toISOString() + req.file.originalname}`;
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
    const Business = {
      businessId: `${Businesses.length + 1}`,
      businessName: req.body.businessName ? req.body.businessName.trim() : req.body.businessName,
      userId: req.body.userId ? req.body.userId.trim() : req.body.userId,
      description: req.body.description ? req.body.description.trim() : req.body.description,
      location: req.body.location ? req.body.location.trim() : req.body.location,
      category: req.body.category ? req.body.category.trim() : req.body.category,
      registered: new Date(),
      companyImage: filePath,
    };
    // image to be saved
    const picture = filePath;
    if (!req.body.businessName || !req.body.userId || !req.body.description ||
      !req.body.location || !req.body.category) {
      if (picture) {
        deleteFile(`./${picture}`);
      }
      return res.status(206).json({ message: 'Incomplete fields', error: true });
    }
    Businesses.push(Business);
    // Businesses.push(req.body);
    return res.status(201).json({ Businesses: Business, message: 'Success', error: false });
  },
  // update business
  update(req, res) {
    let filePath = '';
    if (req.file) {
      const tempPath = req.file.path;
      const targetPath = `./businessesUploads/${new Date().toISOString() + req.file.originalname}`;
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
    for (const Business of Businesses) {
    // holds the url of the image before update in other not to loose it
      const picture = Business.companyImage;

      if (Business.businessId === req.params.businessId) {
        Business.businessName = req.body.businessName ?
          req.body.businessName.trim() : Business.businessName;
        Business.userId = req.body.userId ? req.body.userId.trim() : Business.userId;
        Business.description = req.body.description ?
          req.body.description.trim() : Business.description;
        Business.location = req.body.location ? req.body.location.trim() : Business.location;
        Business.category = req.body.category ? req.body.category.trim() : Business.category;
        // if file and url is not empty delete img for updation
        if (req.file) {
          if (Business.companyImage) {
            deleteFile(`./${Business.companyImage}`);
          }
        }
        Business.companyImage = req.file ? filePath : picture;
        return res.json({ Businesses: Business, message: 'Bussiness updated!', error: false });
      }
    }
    // remove file if id is not available
    if (req.file) {
      deleteFile(`./${filePath}`);
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  // delete business
  destroy(req, res) {
    let i = 0;
    for (const Business of Businesses) {
      if (Business.businessId === req.params.businessId) {
        if (Business.companyImage) {
          deleteFile(`./${Business.companyImage}`);
        }
        Businesses.splice(i, 1);
        return res.status(204).json({ Businesses, message: 'Business successfully deleted!', error: false });
      }i += 1;
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  // get a business
  retrieve(req, res) {
    for (const Business of Businesses) {
      if (Business.businessId === req.params.businessId) {
        return res.json({ Businesses: Business, message: 'Success', error: false });
      }
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  // get businesses
  list(req, res) {
    if (!req.query.location && !req.query.category) {
      return res.json({ Businesses, message: 'Success', error: false });
    }
    if (req.query.location && !req.query.category) {
      const array = [];
      for (const Business of Businesses) {
        if (Business.location === req.query.location) { array.push(Business); }
      }
      if (array.length !== 0) { return res.json({ Businesses: array, message: 'Success', error: false }); }
    }
    if (req.query.category && !req.query.location) {
      const array = [];
      for (const Business of Businesses) {
        if (Business.category === req.query.category) { array.push(Business); }
      }
      if (array.length !== 0) { return res.json({ Businesses: array, message: 'Success', error: false }); }
    }
    if (req.query.location && req.query.category) {
      const array = [];
      for (const Business of Businesses) {
        if (Business.location === req.query.location && Business.category === req.query.category) {
          array.push(Business);
        }
      }
      if (array.length !== 0) { return res.json({ Businesses: array, message: 'Success', error: false }); }
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  },
};

export default businessesController;
