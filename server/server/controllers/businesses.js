import multer from 'multer';
import fs from 'file-system';
import model from '../models';

const Business = model.Business;
const Review = model.Review;

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

    if (!req.body.businessName || !req.body.userId || !req.body.description ||
      !req.body.email || !req.body.phone || !req.body.category) {
      if (filePath) { deleteFile(`./${filePath}`); }
      return res.status(206).send({message: 'Incomplete fields'});
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
        userId: req.body.userId,
      })
      .then(business => res.status(201).send(business))
      .catch(error => {
        if (filePath) {deleteFile(`./${filePath}`);}
        return res.status(400).send(error)
      });
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

    return Business
      .findById(req.params.businessId, {
        include: [{
          model: Review,
          as: 'reviews'
        }]
      })
      .then(business => {
        if(!business) {
          return res.status(404).send({message: 'Bussiness not found'})
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
              userId: req.body.userId || business.userId,
            })
            .then(business => {
              // if file and url is not empty delete img for updation
                if (filePath) {
                  if (previousImage) {
                    deleteFile(`./${previousImage}`);
                  }
                }
              return res.status(200).send(business)})
            .catch(error => {
              if (filePath) {deleteFile(`./${filePath}`);}
              return res.status(400).send(error)});
      }).catch(error => res.status(400).send(error));

  },
  // delete business
  destroy(req, res) {
    return Business
      .findById(req.params.businessId)
      .then(business => {
        if(!business){
          return res.status(404).send({message: 'Business not found'});
        }
        return business
          .destroy()
          .then(() => {
            if (business.companyImage) {
                  deleteFile(`./${business.companyImage}`);
            }
            return res.status(204).send();})
          .catch(error => res.status(400).send(error));
      }).catch(error => res.status(400).send(error));
  },
  // get a business
  retrieve(req, res) {
    return Business
      .findById(req.params.businessId, {
        include: [{
          model: Review,
          as: 'reviews'
        }]
      })
      .then(business => {
        if(!business) {
          return res.status(404).send({message: 'Bussiness not found'})
        }
        return res.status(200).send(business);})
      .catch(error => res.status(400).send(error));
  },
  // get businesses
  list(req, res) {
    let selectionType;
    if (!req.query.location && !req.query.category) {
      selectionType = Business
        .findAll({
          include: [{ model: Review, as: 'reviews' }]
        });
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
      .then(business =>{
        if(business.length === 0){
          return res.status(404).send({message: 'Businesses not found'});
        }
        res.status(404).send(business)})
      .catch(error => res.status(400).send(error));
  },
};

export default businessesController;
