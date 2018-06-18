import Users from '../models/user';

const usersController = {
  create(req, res) {
    const user = {
      id: Users.length + 1,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    if (!req.body.name || !req.body.username || !req.body.email || !req.body.password) {
      return res.status(206).json({ message: 'Incomplete field', error: true });
    }

    // Users.push(req.body);
    Users.push(user);
    return res.status(201).json({ Users, message: 'Success', error: false });
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
        User.name = req.body.name;
        User.username = req.body.username;
        User.email = req.body.email;
        User.password = req.body.password;
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
