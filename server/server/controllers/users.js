import multer from 'multer';
import fs from 'file-system';
import Users from '../models/user';

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

const usersController = {
  // image upload
  upload: upload.single('userImage'),
  // create a user
  create(req, res) {
    let filePath = '';
    if (req.file) {
      const tempPath = req.file.path;
      const targetPath = `./usersUploads/${new Date().toISOString() + req.file.originalname}`;
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
    const User = {
      id: Users.length + 1,
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
    const picture = filePath;
    if (!req.body.title || !req.body.firstname || !req.body.lastname ||
      !req.body.username || !req.body.password || !req.body.email ||
      !req.body.gender || !req.body.dob || !req.body.phone) {
      if (picture) {
        deleteFile(`./${picture}`);
      }
      return res.status(206).json({ message: 'Incomplete field', error: true });
    }
    // Users.push(req.body);
    Users.push(User);
    return res.status(201).json({ Users: User, message: 'Success', error: false });
  },
  // login with username and password
  check(req, res) {
    for (const User of Users) {
      if (User.username === req.body.username && User.password === req.body.password) {
        return res.json({ Users: User, message: 'Success', error: false });
      }
    }
    return res.status(404).json({ message: 'User not found', error: true });
  },
  list(req, res) {
    return res.json({ Users, error: false });
  },
  // update user
  update(req, res) {
    let filePath = '';
    if (req.file) {
      const tempPath = req.file.path;
      const targetPath = `./usersUploads/${new Date().toISOString() + req.file.originalname}`;

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
    for (const User of Users) {
      if (User.id === parseInt(req.params.userId, 10)) {
      // holds the url of the image before update in other not to loose it
        const picture = User.userImage;

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
            deleteFile(`./${User.userImage}`);
          }
        }
        User.userImage = req.file ? filePath : picture;
        return res.json({ Users: User, message: 'User updated!', error: false });
      }
    }
    // remove file if id is not available
    if (req.file) {
      deleteFile(`./${filePath}`);
    }
    return res.status(404).json({ message: 'User not found', error: true });
  },
  // delete user
  destroy(req, res) {
    let i = 0;
    for (const User of Users) {
      if (User.id === parseInt(req.params.userId, 10)) {
        if (User.userImage.trim()) {
          deleteFile(`./${User.userImage}`);
        }
        Users.splice(i, 1);
        return res.status(204).json({ Users, message: 'User deleted!', error: false });
      }i += 1;
    }
    return res.status(404).json({ message: 'User not found', error: true });
  },
  // get a user
  retrieve(req, res) {
    for (const User of Users) {
      if (User.id === parseInt(req.params.userId, 10)) {
        return res.json({ Users: User, message: 'Success', error: false });
      }
    }
    return res.status(404).json({ message: 'User not found', error: true });
  },
};

export default usersController;
