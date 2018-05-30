const usersController = require('../controllers/users');
const businessesController = require('../controllers/businesses');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!'
  }));

  app.post('/auth/signup', usersController.create);
  app.post('/auth/login', usersController.check);
  app.get('/api/users', usersController.list);
  app.put('/api/users/:userId', usersController.update);
  app.get('/api/users/:userId', usersController.retrieve);
  app.delete('/api/users/:userId', usersController.destroy);

  app.post('/businesses/', businessesController.create);
  app.put('/businesses/:businessId', businessesController.update);
  app.delete('/businesses/:businessId', businessesController.destroy);
  app.get('/businesses/:businessId', businessesController.retrieve);
  app.get('/businesses/', businessesController.list);
};
