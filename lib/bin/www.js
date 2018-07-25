

const _http = require('http');

const _http2 = _interopRequireDefault(_http);

const _app = require('../app');

const _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The express app we just created

// This will be our application entry. We'll setup our server here.
const port = parseInt(process.env.PORT, 10) || 8000;
_app2.default.set('port', port);

const server = _http2.default.createServer(_app2.default);
server.listen(port);
