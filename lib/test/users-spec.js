'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _user = require('../server/models/user');

var _user2 = _interopRequireDefault(_user);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Require the dev-dependencies
_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

describe('Users', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    _user2.default.splice(0, _user2.default.length);
    done();
  });

  describe('/GET user', function () {
    it('it should GET all the users', function (done) {
      _chai2.default.request(_app2.default).get('/api/users').end(function (err, res) {
        res.should.have.status(200);
        res.body.Users.should.be.a('array');
        res.body.Users.length.should.be.eql(0);
        res.body.error.should.be.eql(false);
        done();
      });
    });
  });

  describe('/POST user', function () {
    it('it should not POST a user without reviews', function (done) {
      var user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        password: 'abc'
      };

      _chai2.default.request(_app2.default).post('/auth/signup').send(user).end(function (err, res) {
        res.should.have.status(206);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Incomplete field');
        res.body.should.have.property('error').eql(true);
        done();
      });
    });

    it('it should post a business', function (done) {
      var user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        email: 'justin@gmail.com',
        password: 'abc'
      };

      _chai2.default.request(_app2.default).post('/auth/signup').send(user).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('Users');
        res.body.Users.should.be.a('array');
        res.body.Users.should.have.keys('0');
        res.body.Users.should.have.property('0');
        res.body.Users.should.have.deep.property('0', user).property('id');
        res.body.Users.should.have.deep.property('0', user).property('name');
        res.body.Users.should.have.deep.property('0', user).property('username');
        res.body.Users.should.have.deep.property('0', user).property('email');
        res.body.Users.should.have.deep.property('0', user).property('password');
        res.body.should.have.property('message').eql('Success');
        res.body.should.have.property('error').eql(false);
        done();
      });
    });
    it('it should POST username && password and get the particular user ', function (done) {
      var user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        password: 'abc'
      };

      _user2.default.push(user);
      _chai2.default.request(_app2.default).post('/auth/login').send({ username: 'justman', password: 'abc' }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Users.should.have.property('id');
        res.body.Users.should.have.property('name');
        res.body.Users.should.have.property('username').eql('justman');
        res.body.Users.should.have.property('password').eql('abc');
        res.body.should.have.property('message').eql('Success');
        res.body.error.should.be.eql(false);
        done();
      });
    });
  });

  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id user', function () {
    it('it should GET a user by the given id', function (done) {
      var user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        email: 'justin@gmail.com',
        password: 'abc'
      };

      // Passing user to user model
      _user2.default.push(user);
      _chai2.default.request(_app2.default).get('/api/users/' + user.id).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Users.should.have.property('name');
        res.body.Users.should.have.property('username');
        res.body.Users.should.have.property('email');
        res.body.Users.should.have.property('password');
        res.body.Users.should.have.property('id').eql(user.id);
        done();
      });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id user', function () {
    it('it should UPDATE a user given the id', function (done) {
      var user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        email: 'justin@gmail.com',
        password: 'abc'
      };

      // Passing user to user model
      _user2.default.push(user);

      _chai2.default.request(_app2.default).put('/api/users/' + user.id).send({
        id: 12,
        name: 'justin',
        username: 'sojust',
        email: 'justin@gmail.com',
        password: 'abcd'
      }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User updated!');
        res.body.Users.should.have.property('password').eql('abcd');
        done();
      });
    });
  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id user', function () {
    it('it should DELETE a user given the id', function (done) {
      var user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        email: 'justin@gmail.com',
        password: 'abc'
      };

      // Passing user to user model
      _user2.default.push(user);
      _chai2.default.request(_app2.default).delete('/api/users/' + user.id).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User deleted!');
        done();
      });
    });
  });
});