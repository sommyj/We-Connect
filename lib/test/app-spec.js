

const _chai = require('chai');

const _chai2 = _interopRequireDefault(_chai);

const _chaiHttp = require('chai-http');

const _chaiHttp2 = _interopRequireDefault(_chaiHttp);

const _app = require('../app');

const _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should(); // Require the dev-dependencies

_chai2.default.use(_chaiHttp2.default);

describe('/GET /*', () => {
  it('it should GET api message', (done) => {
    _chai2.default.request(_app2.default).get('/anything').end((err, res) => {
      res.should.have.status(200);
      res.body.message.should.be.eql('Welcome to the beginning of nothingness.');
      done();
    });
  });
});

describe('/GET /api', () => {
  it('it should GET api message', (done) => {
    _chai2.default.request(_app2.default).get('/api').end((err, res) => {
      res.should.have.status(200);
      res.body.message.should.be.eql('Welcome to the User API!');
      done();
    });
  });
});
