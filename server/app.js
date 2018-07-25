import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './server/routes/index';

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

app.use('/usersUploads', express.static('usersUploads'));
app.use('/businessesUploads', express.static('businessesUploads'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
// app.use(bodyParser.raw({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Require our routes into the application.
routes(app);
// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

// module.exports = app;
export default app;
