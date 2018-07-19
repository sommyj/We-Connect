import multer from 'multer';
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
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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

const usersController = {
  upload: upload.single('userImage'),
  create(req, res) {
    console.log(req.file);
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

    if (!req.body.title || !req.body.firstname || !req.body.lastname || !req.body.username || !req.body.password
      || !req.body.email || !req.body.gender || !req.body.dob || !req.body.phone) {
      return res.status(206).json({ message: 'Incomplete field', error: true });
    }

    // Users.push(req.body);
    Users.push(User);
    return res.status(201).json({ Users: User, message: 'Success', error: false });
  },
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
  update(req, res) {
    for (const User of Users) {
      if (User.id === parseInt(req.params.userId, 10)) {
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
        User.picture = req.file ? req.file.path : '';

        return res.json({ Users: User, message: 'User updated!', error: false });
      }
    }
    return res.status(404).json({ message: 'User not found', error: true });
  },
  destroy(req, res) {
    let i = 0;
    for (const User of Users) {
      if (User.id === parseInt(req.params.userId, 10)) {
        Users.splice(i, 1);
        return res.status(204).json({ Users, message: 'User deleted!', error: false });
      }
      i += 1;
    }
    return res.status(404).json({ message: 'User not found', error: true });
  },
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
