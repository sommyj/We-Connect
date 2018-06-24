import { usersController, businessesController, reviewsController } from '../controllers/index';

const routes = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!'
  }));

  app.post('/auth/v1/signup', usersController.create);
  app.post('/auth/v1/login', usersController.check);
  app.get('/api/v1/users', usersController.list);
  app.put('/api/v1/users/:userId', usersController.update);
  app.get('/api/v1/users/:userId', usersController.retrieve);
  app.delete('/api/v1/users/:userId', usersController.destroy);

  app.post('/v1/businesses/', businessesController.create);
  app.put('/v1/businesses/:businessId', businessesController.update);
  app.delete('/v1/businesses/:businessId', businessesController.destroy);
  app.get('/v1/businesses/:businessId', businessesController.retrieve);
  app.get('/v1/businesses/', businessesController.list);

  app.post('/v1/businesses/:businessId/reviews', reviewsController.create);
  app.get('/v1/businesses/:businessId/reviews', reviewsController.retrieve);
};

export default routes;
