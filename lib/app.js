

Object.defineProperty(exports, '__esModule', {
  value: true
});

const _express = require('express');

const _express2 = _interopRequireDefault(_express);

const _morgan = require('morgan');

const _morgan2 = _interopRequireDefault(_morgan);

const _bodyParser = require('body-parser');

const _bodyParser2 = _interopRequireDefault(_bodyParser);

const _index = require('./server/routes/index');

const _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Set up the express app
const app = (0, _express2.default)();

// Log requests to the console.
app.use((0, _morgan2.default)('dev'));

app.use('/usersUploads', _express2.default.static('usersUploads'));
app.use('/businessesUploads', _express2.default.static('businessesUploads'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(_bodyParser2.default.json());
// app.use(bodyParser.raw({ type: 'application/*+json' }));
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// Require our routes into the application.
(0, _index2.default)(app);
// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.'
}));

// module.exports = app;
exports.default = app;
