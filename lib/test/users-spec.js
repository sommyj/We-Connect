'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _fileSystem = require('file-system');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _user = require('../server/models/user');

var _user2 = _interopRequireDefault(_user);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Require the dev-dependencies
_chai2.default.should();
var request = (0, _supertest2.default)(_app2.default);

/**
 * copy file from a directory to another
 * @param {String} src The source you are copying from.
 * @param {String} dest The destination you are copying to.
 * @returns {void} nothing.
 */
function copyFile(src, dest) {
  var readStream = _fileSystem2.default.createReadStream(src);

  readStream.pipe(_fileSystem2.default.createWriteStream(dest));
}

describe('Users', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    _user2.default.splice(0, _user2.default.length);
    done();
  });

  describe('/GET user', function () {
    it('it should GET all the users', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users').end(function (err, res) {
        res.should.have.status(200);
        res.body.Users.should.be.a('array');
        res.body.Users.length.should.be.eql(0);
        res.body.error.should.be.eql(false);
        done();
      });
    });
  });

  describe('/POST user', function () {
    it('it should not POST a user without firstname, lastname, username, password,\n     email, gender, street, city, state, dob, phone', function (done) {
      request.post('/auth/v1/signup').field('id', '1').field('title', 'mr').field('firstname', '').field('lastname', '').field('username', '').field('password', '').field('email', '').field('gender', '').field('street', '').field('city', '').field('state', '').field('dob', '').field('phone', '').attach('userImage', './testFile.png').end(function (err, res) {
        res.should.have.status(206);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Incomplete field');
        res.body.should.have.property('error').eql(true);
        done();
      });
    });

    it('it should post a user', function (done) {
      request.post('/auth/v1/signup').field('id', '1').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('street', 'ljan terrasse 346').field('city', 'ikotun').field('state', 'lagos').field('dob', '2015-11-04').field('phone', '66976498').attach('userImage', './testFile.png').end(function (err, res) {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('Users');
        res.body.Users.should.have.property('id').eql(1);
        res.body.Users.should.have.property('firstname').eql('Justin');
        res.body.Users.should.have.property('lastname').eql('Ikwuoma');
        res.body.Users.should.have.property('username').eql('justman');
        res.body.Users.should.have.property('email').eql('justin@gmail.com');
        res.body.Users.should.have.property('password').eql('abc');
        res.body.Users.should.have.property('gender').eql('male');
        res.body.Users.should.have.property('street').eql('ljan terrasse 346');
        res.body.Users.should.have.property('city').eql('ikotun');
        res.body.Users.should.have.property('userImage').eql(_user2.default[0].userImage);
        res.body.should.have.property('message').eql('Success');
        res.body.should.have.property('error').eql(false);

        // delete test image file
        if (_user2.default[0].userImage) {
          _fileSystem2.default.unlink('./' + _user2.default[0].userImage, function (err) {
            if (err) throw err;
          });
        }

        done();
      });
    });

    it('it should post a user without image', function (done) {
      request.post('/auth/v1/signup').field('id', '1').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('street', 'ljan terrasse 346').field('city', 'ikotun').field('state', 'lagos').field('dob', '2015-11-04').field('phone', '66976498').attach('userImage', '').end(function (err, res) {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('Users');
        res.body.Users.should.have.property('id').eql(1);
        res.body.Users.should.have.property('firstname').eql('Justin');
        res.body.Users.should.have.property('lastname').eql('Ikwuoma');
        res.body.Users.should.have.property('username').eql('justman');
        res.body.Users.should.have.property('email').eql('justin@gmail.com');
        res.body.Users.should.have.property('password').eql('abc');
        res.body.Users.should.have.property('gender').eql('male');
        res.body.Users.should.have.property('street').eql('ljan terrasse 346');
        res.body.Users.should.have.property('city').eql('ikotun');
        res.body.Users.should.have.property('userImage').eql('');
        res.body.should.have.property('message').eql('Success');
        res.body.should.have.property('error').eql(false);

        done();
      });
    });

    it('it should not post a user when image file type not jpg/png', function (done) {
      request.post('/auth/v1/signup').field('id', '1').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'justman').field('password', 'abc').field('email', 'justin@gmail.com').field('gender', 'male').field('street', 'ljan terrasse 346').field('city', 'ikotun').field('state', 'lagos').field('dob', '2015-11-04').field('phone', '66976498').attach('userImage', './testFileType.txt').end(function (err, res) {
        res.should.have.status(500);
        res.body.should.be.a('object');
        done();
      });
    });

    it('it should POST username && password and get the particular user ', function (done) {
      var user = {
        id: 12,
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman',
        password: 'abc',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: ''
      };

      _user2.default.push(user);
      request.post('/auth/v1/login').send({ username: 'justman', password: 'abc' }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Users.should.have.property('id');
        res.body.Users.should.have.property('firstname').eql('justin');
        res.body.Users.should.have.property('lastname').eql('Ikwuoma');
        res.body.Users.should.have.property('username').eql('justman');
        res.body.Users.should.have.property('email').eql('justin@gmail.com');
        res.body.Users.should.have.property('password').eql('abc');
        res.body.Users.should.have.property('userImage').eql('');
        res.body.should.have.property('message').eql('Success');
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should not get a particular user if POST a wrong username && password', function (done) {
      var user = {
        id: 1,
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman',
        password: 'abc',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: ''
      };

      _user2.default.push(user);
      request.post('/auth/v1/login').send({ username: 'justin', password: 'abc' }).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.message.should.be.eql('User not found');
        res.body.error.should.be.eql(true);
        done();
      });
    });
  });

  /*
  * Test the /GET/ route
  */
  describe('/GET/ user', function () {
    it('it should GET all users', function (done) {
      var user = [{
        id: 12,
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman',
        password: 'abc',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: ''
      }, {
        id: 13,
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'sommy',
        password: '123',
        email: 'somto@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: ''
      }];

      // Passing user to user model
      _user2.default.push(user[0]);
      _user2.default.push(user[1]);
      request.get('/api/v1/users/').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Users.should.have.property('0');
        res.body.Users.should.have.property('1');
        res.body.Users.should.have.deep.property('0', user[0]);
        res.body.Users.should.have.deep.property('1', user[1]);
        res.body.Users.should.have.deep.property('0', user[0]).property('id').eql(user[0].id);
        res.body.Users.should.have.deep.property('1', user[1]).property('id').eql(user[1].id);
        res.body.Users.should.have.deep.property('0', user[0]).property('firstname').eql(user[0].firstname);
        res.body.Users.should.have.deep.property('1', user[1]).property('firstname').eql(user[1].firstname);
        res.body.Users.should.have.deep.property('0', user[0]).property('lastname').eql(user[0].lastname);
        res.body.Users.should.have.deep.property('1', user[1]).property('lastname').eql(user[1].lastname);
        res.body.Users.should.have.deep.property('0', user[0]).property('username').eql(user[0].username);
        res.body.Users.should.have.deep.property('1', user[1]).property('username').eql(user[1].username);
        res.body.Users.should.have.deep.property('0', user[0]).property('email').eql(user[0].email);
        res.body.Users.should.have.deep.property('1', user[1]).property('email').eql(user[1].email);
        res.body.Users.should.have.deep.property('0', user[0]).property('password').eql(user[0].password);
        res.body.Users.should.have.deep.property('1', user[1]).property('password').eql(user[1].password);
        res.body.Users.should.have.deep.property('0', user[0]).property('gender').eql(user[0].gender);
        res.body.Users.should.have.deep.property('1', user[1]).property('gender').eql(user[1].gender);
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should GET a user by the given id', function (done) {
      var user = {
        id: 12,
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman',
        password: 'abc',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: 'usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG'
      };

      // Passing user to user model
      _user2.default.push(user);
      request.get('/api/v1/users/' + user.id).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Users.should.have.property('firstname').eql('justin');
        res.body.Users.should.have.property('lastname').eql('Ikwuoma');
        res.body.Users.should.have.property('username').eql('justman');
        res.body.Users.should.have.property('email').eql('justin@gmail.com');
        res.body.Users.should.have.property('password').eql('abc');
        res.body.Users.should.have.property('id').eql(user.id);
        res.body.Users.should.have.property('userImage').eql('usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG');
        done();
      });
    });

    it('it should not GET a user by the given wrong id', function (done) {
      var user = {
        id: 12,
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman',
        password: 'abc',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: 'usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG'
      };

      // Passing user to user model
      _user2.default.push(user);
      request.get('/api/v1/users/14').end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.message.should.be.eql('User not found');
        res.body.error.should.be.eql(true);
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
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman',
        password: 'abc',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: ''
      };

      // Passing user to user model
      _user2.default.push(user);

      request.put('/api/v1/users/' + user.id).field('id', '1').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'sojust').field('password', 'abcd').field('email', 'justin@gmail.com').field('gender', 'male').field('street', 'ljan terrasse 346').field('city', 'ikotun').field('state', 'lagos').field('dob', '2015-11-04').field('phone', '66976498').attach('userImage', './testFile.png').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User updated!');
        res.body.Users.should.have.property('title').eql('mr');
        res.body.Users.should.have.property('firstname').eql('Justin');
        res.body.Users.should.have.property('lastname').eql('Ikwuoma');
        res.body.Users.should.have.property('password').eql('abcd');
        res.body.Users.should.have.property('username').eql('sojust');
        res.body.Users.should.have.property('email').eql('justin@gmail.com');
        res.body.Users.should.have.property('userImage').eql(_user2.default[0].userImage);

        // delete test image file
        if (_user2.default[0].userImage) {
          _fileSystem2.default.unlink('./' + _user2.default[0].userImage, function (err) {
            if (err) throw err;
          });
        }

        done();
      });
    });

    it('it should not UPDATE a user given the wrong id', function (done) {
      var user = {
        id: 12,
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman',
        password: 'abc',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: ''
      };

      // Passing user to user model
      _user2.default.push(user);

      request.put('/api/v1/users/14').field('id', '1').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'sojust').field('password', 'abcd').field('email', 'justin@gmail.com').field('gender', 'male').field('street', 'ljan terrasse 346').field('city', 'ikotun').field('state', 'lagos').field('dob', '2015-11-04').field('phone', '66976498').attach('userImage', './testFile.png').end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User not found');
        res.body.error.should.be.eql(true);
        done();
      });
    });

    it('it should UPDATE a user given the id and\n      maintain already existing fields and file if none is entered', function (done) {
      var user = {
        id: 12,
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman',
        password: 'abcd',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: 'usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG'
      };

      // Passing user to user model
      _user2.default.push(user);

      request.put('/api/v1/users/' + user.id).field('id', '1').field('title', 'mr').field('firstname', '').field('lastname', '').field('username', '').field('password', '').field('email', '').field('gender', '').field('street', '').field('city', '').field('state', '').field('dob', '').field('phone', '').attach('userImage', '').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User updated!');
        res.body.Users.should.have.property('title').eql('mr');
        res.body.Users.should.have.property('firstname').eql('Justin');
        res.body.Users.should.have.property('lastname').eql('Ikwuoma');
        res.body.Users.should.have.property('password').eql('abcd');
        res.body.Users.should.have.property('username').eql('justman');
        res.body.Users.should.have.property('email').eql('justin@gmail.com');
        res.body.Users.should.have.property('userImage').eql(_user2.default[0].userImage);

        done();
      });
    });

    it('it should UPDATE a user given the id and replace already existing file', function (done) {
      var user = {
        id: 12,
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman',
        password: 'abc',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: 'usersUploads/testFile.png'
      };

      // Passing user to user model
      _user2.default.push(user);

      var filename = 'testFile.png';
      var src = _path2.default.join('./', filename);
      var destDir = _path2.default.join('./', 'usersUploads');

      _fileSystem2.default.access(destDir, function (err) {
        if (err) {
          _fileSystem2.default.mkdirSync(destDir);
        }

        copyFile(src, _path2.default.join(destDir, filename));
      });

      request.put('/api/v1/users/' + user.id).field('id', '1').field('title', 'mr').field('firstname', 'Justin').field('lastname', 'Ikwuoma').field('username', 'sojust').field('password', 'abcd').field('email', 'justin@gmail.com').field('gender', 'male').field('street', 'ljan terrasse 346').field('city', 'ikotun').field('state', 'lagos').field('dob', '2015-11-04').field('phone', '66976498').attach('userImage', './testFile.png').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User updated!');
        res.body.Users.should.have.property('title').eql('mr');
        res.body.Users.should.have.property('firstname').eql('Justin');
        res.body.Users.should.have.property('lastname').eql('Ikwuoma');
        res.body.Users.should.have.property('password').eql('abcd');
        res.body.Users.should.have.property('username').eql('sojust');
        res.body.Users.should.have.property('email').eql('justin@gmail.com');
        res.body.Users.should.have.property('userImage').eql(_user2.default[0].userImage);

        // delete test image file
        if (_user2.default[0].userImage) {
          _fileSystem2.default.unlink('./' + _user2.default[0].userImage, function (err) {
            if (err) throw err;
          });
        }

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
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'sojust',
        password: 'abcd',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: 'usersUploads/testFile.png'
      };

      // Passing user to user model
      _user2.default.push(user);

      var filename = 'testFile.png';
      var src = _path2.default.join('./', filename);
      var destDir = _path2.default.join('./', 'usersUploads');

      // copy image file to businessesUploads
      _fileSystem2.default.access(destDir, function (err) {
        if (err) {
          _fileSystem2.default.mkdirSync(destDir);
        }

        copyFile(src, _path2.default.join(destDir, filename));
      });

      request.delete('/api/v1/users/' + user.id).end(function (err, res) {
        res.should.have.status(204);
        res.body.should.be.a('object');
        done();
      });
    });

    it('it should not DELETE a user given the wrong id', function (done) {
      var user = {
        id: 12,
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'sojust',
        password: 'abcd',
        email: 'justin@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        dob: '2015-11-04',
        registered: '2015-11-04T22:09:36Z',
        phone: '66976498',
        userImage: ''
      };

      // Passing user to user model
      _user2.default.push(user);
      _chai2.default.request(_app2.default).delete('/api/v1/users/15').end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User not found');
        res.body.error.should.be.eql(true);
        done();
      });
    });
  });

  describe('connect.static()', function () {
    it('should serve static files', function (done) {
      var filename = 'testFile.png';
      var src = _path2.default.join('./', filename);
      var destDir = _path2.default.join('./', 'usersUploads');

      // copy image file to businessesUploads
      _fileSystem2.default.access(destDir, function (err) {
        if (err) {
          _fileSystem2.default.mkdirSync(destDir);
        }

        copyFile(src, _path2.default.join(destDir, filename));
      });

      request.get('/usersUploads/testFile.png').end(function () {
        // delete test image file
        if (_path2.default.resolve('./usersUploads/testFile.png')) {
          _fileSystem2.default.unlink('./usersUploads/testFile.png', function (err) {
            if (err) throw err;
          });
        }
        done();
      });
    });
  });
});