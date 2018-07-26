import multer from 'multer';
import fs from 'file-system';
import Businesses from '../models/business';

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('File should be jpeg or png'), false);
  }
};

const upload = multer({
  dest: './businessesUploads/',
  // storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType('text/plain')
    .end('Oops! Something went wrong!');
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
      // rename file to an appropriate name
      fs.rename(tempPath, targetPath, (err) => { if (err) return handleError(err, res); });
      // remove the dot in targetPath
      filePath = targetPath.substring(1, targetPath.length);
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
        fs.unlink(`./${picture}`, (err) => { if (err) return handleError(err, res); });
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
      // rename file to an appropriate name
      fs.rename(tempPath, targetPath, (err) => { if (err) return handleError(err, res); });
      // remove the dot in targetPath
      filePath = targetPath.substring(1, targetPath.length);
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
            fs.unlink(`./${Business.companyImage}`, (err) => { if (err) return handleError(err, res); });
          }
        }
        Business.companyImage = req.file ? filePath : picture;
        return res.json({ Businesses: Business, message: 'Bussiness updated!', error: false });
      }
    }
    // remove file if id is not available
    if (req.file) {
      fs.unlink(`./${filePath}`, (err) => { if (err) return handleError(err, res); });
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  // delete business
  destroy(req, res) {
    let i = 0;
    for (const Business of Businesses) {
      if (Business.businessId === req.params.businessId) {
        if (Business.companyImage) {
          fs.unlink(`./${Business.companyImage}`, (err) => { if (err) return handleError(err, res); });
        }Businesses.splice(i, 1);
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
