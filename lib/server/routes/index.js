'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../controllers/index');

var routes = function routes(app) {
  app.get('/api', function (req, res) {
    return res.status(200).send({
      message: 'Welcome to the User API!'
    });
  });

  app.post('/auth/signup', _index.usersController.create);
  app.post('/auth/login', _index.usersController.check);
  app.get('/api/users', _index.usersController.list);
  app.put('/api/users/:userId', _index.usersController.update);
  app.get('/api/users/:userId', _index.usersController.retrieve);
  app.delete('/api/users/:userId', _index.usersController.destroy);

  app.post('/businesses/', _index.businessesController.create);
  app.put('/businesses/:businessId', _index.businessesController.update);
  app.delete('/businesses/:businessId', _index.businessesController.destroy);
  app.get('/businesses/:businessId', _index.businessesController.retrieve);
  app.get('/businesses/', _index.businessesController.list);
};

exports.default = routes;