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

  app.post('/auth/v1/signup', _index.usersController.create);
  app.post('/auth/v1/login', _index.usersController.check);
  app.get('/api/v1/users', _index.usersController.list);
  app.put('/api/v1/users/:userId', _index.usersController.update);
  app.get('/api/v1/users/:userId', _index.usersController.retrieve);
  app.delete('/api/v1/users/:userId', _index.usersController.destroy);

  app.post('/v1/businesses/', _index.businessesController.create);
  app.put('/v1/businesses/:businessId', _index.businessesController.update);
  app.delete('/v1/businesses/:businessId', _index.businessesController.destroy);
  app.get('/v1/businesses/:businessId', _index.businessesController.retrieve);
  app.get('/v1/businesses/', _index.businessesController.list);

  app.post('/v1/businesses/:businessId/reviews', _index.reviewsController.create);
  app.get('/v1/businesses/:businessId/reviews', _index.reviewsController.retrieve);
};

exports.default = routes;