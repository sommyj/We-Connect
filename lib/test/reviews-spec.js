

const _chai = require('chai');

const _chai2 = _interopRequireDefault(_chai);

const _chaiHttp = require('chai-http');

const _chaiHttp2 = _interopRequireDefault(_chaiHttp);

const _review = require('../server/models/review');

const _review2 = _interopRequireDefault(_review);

const _app = require('../app');

const _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Require the dev-dependencies
_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

describe('Reviews', () => {
  beforeEach((done) => {
    // Before each test we empty the database
    _review2.default.splice(0, _review2.default.length);
    done();
  });

  describe('/GET review', () => {
    it('it should GET empty reviews', (done) => {
      _chai2.default.request(_app2.default).get('/v1/businesses/1/reviews').end((err, res) => {
        res.should.have.status(200);
        res.body.Reviews.should.be.a('array');
        res.body.should.have.property('Reviews');
        res.body.Reviews.length.should.be.eql(0);
        res.body.error.should.be.eql(false);
        done();
      });
    });
    it('it should GET all the reviews', (done) => {
      const review = [{
        id: 1,
        userId: '3',
        businessId: '2'
      }, {
        id: 7,
        userId: '8',
        businessId: '2'
      }];

      // Passing review to review model
      _review2.default.push(review[0]);
      _review2.default.push(review[1]);
      _chai2.default.request(_app2.default).get('/v1/businesses/2/reviews').end((err, res) => {
        res.should.have.status(200);
        res.body.Reviews.should.be.a('array');
        res.body.should.have.property('Reviews');
        res.body.Reviews.should.have.deep.property(0, review[0]).property('id').eql(1);
        res.body.Reviews.should.have.deep.property(0, review[0]).property('userId').eql('3');
        res.body.Reviews.should.have.deep.property(0, review[0]).property('businessId').eql('2');
        res.body.Reviews.should.have.deep.property(1, review[1]).property('id').eql(7);
        res.body.Reviews.should.have.deep.property(1, review[1]).property('userId').eql('8');
        res.body.Reviews.should.have.deep.property(1, review[1]).property('businessId').eql('2');
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should GET empty reviews if reviews does not exists', (done) => {
      const review = [{
        id: 1,
        userId: '3',
        businessId: '2'
      }, {
        id: 7,
        userId: '8',
        businessId: '2'
      }];

      // Passing review to review model
      _review2.default.push(review[0]);
      _review2.default.push(review[1]);
      _chai2.default.request(_app2.default).get('/v1/businesses/1/reviews').end((err, res) => {
        res.should.have.status(200);
        res.body.Reviews.should.be.a('array');
        res.body.should.have.property('Reviews');
        res.body.Reviews.length.should.be.eql(0);
        res.body.error.should.be.eql(false);
        done();
      });
    });
  });

  describe('/POST review', () => {
    it('it should not POST a review without a response, userId, businessId', (done) => {
      const review = {
        id: 1,
        response: '',
        userId: '',
        businessId: ''
      };

      _chai2.default.request(_app2.default).post('/v1/businesses/2/reviews').send(review).end((err, res) => {
        res.should.have.status(206);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Incomplete field');
        res.body.should.have.property('error').eql(true);
        done();
      });
    });

    it('it should post a review', (done) => {
      const review = {
        id: 1,
        response: 'very good.',
        userId: '3',
        businessId: '2'
      };

      _chai2.default.request(_app2.default).post('/v1/businesses/2/reviews').send(review).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('Reviews');
        res.body.Reviews.should.have.property('id').eql(1);
        res.body.Reviews.should.have.property('response').eql('very good.');
        res.body.Reviews.should.have.property('userId').eql('3');
        res.body.Reviews.should.have.property('businessId').eql('2');
        res.body.should.have.property('message').eql('Success');
        res.body.should.have.property('error').eql(false);
        done();
      });
    });
  });
});
