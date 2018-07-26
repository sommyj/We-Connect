import multer from 'multer';
import fs from 'file-system';
import Users from '../models/user';

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('File should be jpeg or png'), false);
  }
};

const upload = multer({
  dest: './usersUploads/',
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

const usersController = {
  // image upload
  upload: upload.single('userImage'),
  // create a user
  create(req, res) {
    let filePath = '';
    if (req.file) {
      const tempPath = req.file.path;
      const targetPath = `./usersUploads/${new Date().toISOString() + req.file.originalname}`;
      // rename file to an appropriate name
      fs.rename(tempPath, targetPath, (err) => { if (err) return handleError(err, res); });
      filePath = targetPath.substring(1, targetPath.length);
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
        fs.unlink(`./${picture}`, (err) => { if (err) return handleError(err, res); });
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
      // rename file to an appropriate name
      fs.rename(tempPath, targetPath, (err) => { if (err) return handleError(err, res); });
      // remove the dot in targetPath
      filePath = targetPath.substring(1, targetPath.length);
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
            fs.unlink(`./${User.userImage}`, (err) => { if (err) return handleError(err, res); });
          }
        }
        User.userImage = req.file ? filePath : picture;
        return res.json({ Users: User, message: 'User updated!', error: false });
      }
    }
    // remove file if id is not available
    if (req.file) {
      fs.unlink(`./${filePath}`, (err) => { if (err) return handleError(err, res); });
    }
    return res.status(404).json({ message: 'User not found', error: true });
  },
  // delete user
  destroy(req, res) {
    let i = 0;
    for (const User of Users) {
      if (User.id === parseInt(req.params.userId, 10)) {
        if (User.userImage.trim()) {
          fs.unlink(`./${User.userImage}`, (err) => { if (err) return handleError(err, res); });
        }Users.splice(i, 1);
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
