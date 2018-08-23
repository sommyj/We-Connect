import multer from 'multer';
import fs from 'file-system';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import model from '../models';
import app from '../../app';

const [User, Business] = [model.User, model.Business];

const upload = multer({
  dest: './usersUploads/'
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

// Token creation hanlder method
const tokenMethod = (userId) => {
  const token = jwt.sign(
    { id: userId }, app.get('superSecret'),
    { expiresIn: 86400 }// expires in 24 hours
  );
  return token;
};

/* File filter handle method */
const fileFilterMethod = (req) => {
  const fileErrorArray = [];
  let fileSizeError = false;
  let fileTypeError = false;
  let filePath = '';

  if (req.file) {
    const tempPath = `./${req.file.path}`;
    const targetPath = `./usersUploads/${new Date().toISOString() + req.file.originalname}`;
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


const usersController = {
  upload: upload.single('userImage'), // image upload
  // create a user
  create(req, res) {
    // implementing the file filter method
    const fileFilterValues = fileFilterMethod(req, res);
    const fileSizeError = fileFilterValues[0];
    const fileTypeError = fileFilterValues[1];
    const filePath = fileFilterValues[2];

    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);

    /* Required feilds */
    if (!req.body.title || !req.body.firstname || !req.body.lastname ||
      !req.body.username || !req.body.password || !req.body.email ||
      !req.body.gender || !req.body.dob || !req.body.phone) {
      if (filePath) { deleteFile(`./${filePath}`); }
      return res.status(206).send({ message: 'Incomplete field' });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    return User
      .create({
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
      })
      .then((user) => {
        const token = tokenMethod(user.id); // Generate token
        if (token) return res.status(201).send({ user, auth: true, token });
      })
      .catch((error) => {
        if (filePath) deleteFile(`./${filePath}`);
        return res.status(400).send(error);
      });
  },
  // login with username and password
  check(req, res) {
    return User
      .findOne({ where: { username: req.body.username, password: req.body.password } })
      .then((user) => {
        if (!user) return res.status(404).send({ message: 'User not found' });
        const token = tokenMethod(user.id); // Generate token
        if (token) return res.status(200).send({ user, auth: true, token });
      })
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return User
      .findAll({
        include: [{ model: Business, as: 'businesses' }]
      })
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
  // update user
  update(req, res) {
    // implementing the file filter method
    const fileFilterValues = fileFilterMethod(req, res);
    const fileSizeError = fileFilterValues[0];
    const fileTypeError = fileFilterValues[1];
    const filePath = fileFilterValues[2];

    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);

    return User
      .findById(req.params.userId, {
        include: [{ model: Business, as: 'businesses' }]
      })
      .then((user) => {
        if (!user) {
          // if file and url is not empty delete img for updation
          if (filePath) deleteFile(`./${filePath}`);
          return res.status(404).send({ message: 'User not found' });
        }
        // holds the url of the image before update in other not to loose it
        const previousImage = user.userImage;
        return user
          .update({
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
            userImage: filePath || user.userImage,
          })
          .then((userUpdate) => {
            // if file and url is not empty delete img for updation
            if (filePath) {
              if (previousImage) deleteFile(`./${previousImage}`);
            }
            return res.status(200).send(userUpdate);
          }) // Send back the updated user
          .catch((error) => {
            if (filePath) deleteFile(`./${filePath}`);
            return res.status(400).send(error);
          });
      }).catch(error => res.status(400).send(error));
  },
  // delete user
  destroy(req, res) {
    return User
      .findById(req.params.userId)
      .then((user) => {
        if (!user) return res.status(404).send({ message: 'User not found' });

        return user
          .destroy()
          .then(() => {
            if (user.userImage) deleteFile(`./${user.userImage}`);
            return res.status(204).send();
          })
          .catch(error => res.status(400).send(error));
      }).catch(error => res.status(400).send(error));
  },
  // get a user
  retrieve(req, res) {
    return User
      .findById(req.params.userId, {
        include: [{ model: Business, as: 'businesses' }]
      })
      .then((user) => {
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  },
};

export default usersController;
