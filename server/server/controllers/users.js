import multer from 'multer';
import fs from 'file-system';
import Users from '../models/user';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './usersUploads/');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('File should be jpeg or png'), false);
  }
};

const upload = multer({
  storage,
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
    const User = {
      id: Users.length + 1,
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
      dob: req.body.date,
      registered: new Date(),
      phone: req.body.phone,
      userImage: req.file ? req.file.path : ''
    };

    if (!req.body.title || !req.body.firstname || !req.body.lastname ||
      !req.body.username || !req.body.password || !req.body.email ||
      !req.body.gender || !req.body.dob || !req.body.phone) {
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
    for (const User of Users) {
      if (User.id === parseInt(req.params.userId, 10)) {
      // holds the url of the image before update in other not to loose it
        const picture = User.userImage;

        User.title = req.body.title;
        User.firstname = req.body.first;
        User.lastname = req.body.last;
        User.username = req.body.username;
        User.password = req.body.password;
        User.email = req.body.email;
        User.gender = req.body.gender;
        User.street = req.body.street;
        User.city = req.body.city;
        User.state = req.body.state;
        User.phone = req.body.phone;

        // if file and url is not empty delete img for updation
        if (req.file) {
          if (User.userImage.trim()) {
            fs.unlink(`./${User.userImage}`, (err) => {
              if (err) return handleError(err, res);
            });
          }
        }
        User.userImage = req.file ? req.file.path : picture;

        return res.json({ Users: User, message: 'User updated!', error: false });
      }
    }
    return res.status(404).json({ message: 'User not found', error: true });
  },
  // delete user
  destroy(req, res) {
    // console.log(path.join(__dirname, `./usersUploads/2018-07-20T09:10:45.662ZNIIT Certificate (copy).resized.jpg`));
    let i = 0;
    for (const User of Users) {
      if (User.id === parseInt(req.params.userId, 10)) {
        if (User.userImage.trim()) {
          fs.unlink(`./${User.userImage}`, (err) => {
            if (err) return handleError(err, res);
          });
        }
        Users.splice(i, 1);
        return res.status(204).json({ Users, message: 'User deleted!', error: false });
      }
      i += 1;
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
