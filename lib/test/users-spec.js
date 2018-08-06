'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _fileSystem = require('file-system');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _models = require('../server/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies


_chai2.default.should();
var request = (0, _supertest2.default)(_app2.default);
var User = _models2.default.User;

/**
 * copy file from a directory to another
 * @param {String} src The source you are copying from.
 * @param {String} dest The destination you are copying to.
 * @returns {void} nothing.
 */
var copyFile = function copyFile(src, dest) {
  var readStream = _fileSystem2.default.createReadStream(src);

  readStream.pipe(_fileSystem2.default.createWriteStream(dest));
};

/**
 * delete a file
 * @param {String} targetPath The part to delete from
 * @returns {void} nothing.
 */
var deleteFile = function deleteFile(targetPath) {
  _fileSystem2.default.unlink(targetPath, function (err) {
    if (err) throw err;
  });
};

describe('Users', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    User.destroy({ where: {}, force: true }).then(function () {
      return done();
    });
  });

  describe('/GET user', function () {
    it('it should GET all the users', function (done) {
      request.get('/api/v1/users').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });

  describe('/POST user', function () {
    it('it should not POST a user without firstname, lastname, username, password,\n     email, gender, street, city, state, dob, phone', function (done) {
      request.post('/auth/v1/signup').field('title', 'mr').field('firstname', '').field('lastname', '').field('username', '').field('password', '').field('email', '').field('gender', '').field('street', '').field('city', '').field('state', '').field('dob', '').field('phone', '').attach('userImage', './testFile.png').end(function (err, res) {
        res.should.have.status(206);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Incomplete field');
        done();
      });
    });
    //
    //   it('it should POST a user', (done) => {
    //     request
    //       .post('/auth/v1/signup')
    //       .field('id', '1')
    //       .field('title', 'mr')
    //       .field('firstname', 'Justin')
    //       .field('lastname', 'Ikwuoma')
    //       .field('username', 'justman')
    //       .field('password', 'abc')
    //       .field('email', 'justin@gmail.com')
    //       .field('gender', 'male')
    //       .field('street', 'ljan terrasse 346')
    //       .field('city', 'ikotun')
    //       .field('state', 'lagos')
    //       .field('dob', '2015-11-04')
    //       .field('phone', '66976498')
    //       .attach('userImage', './testFile.png')
    //       .end((err, res) => {
    //         res.should.have.status(201);
    //         res.body.should.be.a('object');
    //         res.body.should.have.property('Users');
    //         res.body.Users.should.have.property('id').eql(1);
    //         res.body.Users.should.have.property('firstname').eql('Justin');
    //         res.body.Users.should.have.property('lastname').eql('Ikwuoma');
    //         res.body.Users.should.have.property('username').eql('justman');
    //         res.body.Users.should.have.property('email').eql('justin@gmail.com');
    //         res.body.Users.should.have.property('password').eql('abc');
    //         res.body.Users.should.have.property('gender').eql('male');
    //         res.body.Users.should.have.property('street').eql('ljan terrasse 346');
    //         res.body.Users.should.have.property('city').eql('ikotun');
    //         res.body.Users.should.have.property('userImage').eql(Users[0].userImage);
    //         res.body.should.have.property('message').eql('Success');
    //         res.body.should.have.property('error').eql(false);
    //
    //         // delete test image file
    //         if (Users[0].userImage) {
    //           deleteFile(`./${Users[0].userImage}`);
    //         }
    //
    //         done();
    //       });
    //   });
    //
    //   it('it should POST a user without image', (done) => {
    //     request
    //       .post('/auth/v1/signup')
    //       .field('id', '1')
    //       .field('title', 'mr')
    //       .field('firstname', 'Justin')
    //       .field('lastname', 'Ikwuoma')
    //       .field('username', 'justman')
    //       .field('password', 'abc')
    //       .field('email', 'justin@gmail.com')
    //       .field('gender', 'male')
    //       .field('street', 'ljan terrasse 346')
    //       .field('city', 'ikotun')
    //       .field('state', 'lagos')
    //       .field('dob', '2015-11-04')
    //       .field('phone', '66976498')
    //       .attach('userImage', '')
    //       .end((err, res) => {
    //         res.should.have.status(201);
    //         res.body.should.be.a('object');
    //         res.body.should.have.property('Users');
    //         res.body.Users.should.have.property('id').eql(1);
    //         res.body.Users.should.have.property('firstname').eql('Justin');
    //         res.body.Users.should.have.property('lastname').eql('Ikwuoma');
    //         res.body.Users.should.have.property('username').eql('justman');
    //         res.body.Users.should.have.property('email').eql('justin@gmail.com');
    //         res.body.Users.should.have.property('password').eql('abc');
    //         res.body.Users.should.have.property('gender').eql('male');
    //         res.body.Users.should.have.property('street').eql('ljan terrasse 346');
    //         res.body.Users.should.have.property('city').eql('ikotun');
    //         res.body.Users.should.have.property('userImage').eql('');
    //         res.body.should.have.property('message').eql('Success');
    //         res.body.should.have.property('error').eql(false);
    //
    //         done();
    //       });
    //   });
    //
    //
    //   it('it should not POST a user when image file type not jpg/png', (done) => {
    //     request
    //       .post('/auth/v1/signup')
    //       .field('id', '1')
    //       .field('title', 'mr')
    //       .field('firstname', 'Justin')
    //       .field('lastname', 'Ikwuoma')
    //       .field('username', 'justman')
    //       .field('password', 'abc')
    //       .field('email', 'justin@gmail.com')
    //       .field('gender', 'male')
    //       .field('street', 'ljan terrasse 346')
    //       .field('city', 'ikotun')
    //       .field('state', 'lagos')
    //       .field('dob', '2015-11-04')
    //       .field('phone', '66976498')
    //       .attach('userImage', './testFileType.txt')
    //       .end((err, res) => {
    //         res.should.have.status(403);
    //         res.body.should.be.a('object');
    //         res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
    //         res.body.should.have.property('error').eql(true);
    //         done();
    //       });
    //   });
    //
    //   it(`it should not POST a user
    //     when image file size is larger than 2mb`, (done) => {
    //     request
    //       .post('/auth/v1/signup')
    //       .field('id', '1')
    //       .field('title', 'mr')
    //       .field('firstname', 'Justin')
    //       .field('lastname', 'Ikwuoma')
    //       .field('username', 'justman')
    //       .field('password', 'abc')
    //       .field('email', 'justin@gmail.com')
    //       .field('gender', 'male')
    //       .field('street', 'ljan terrasse 346')
    //       .field('city', 'ikotun')
    //       .field('state', 'lagos')
    //       .field('dob', '2015-11-04')
    //       .field('phone', '66976498')
    //       .attach('userImage', './testFileSize.jpg')
    //       .end((err, res) => {
    //         res.should.have.status(403);
    //         res.body.should.be.a('object');
    //         res.body.should.have.property('message')
    //           .eql('file should not be more than 2mb!');
    //         res.body.should.have.property('error').eql(true);
    //         done();
    //       });
    //   });
    //
    //
    //   it('it should POST username && password and get the particular user ', (done) => {
    //     const user = {
    //       id: 12,
    //       title: 'mr',
    //       firstname: 'justin',
    //       lastname: 'Ikwuoma',
    //       username: 'justman',
    //       password: 'abc',
    //       email: 'justin@gmail.com',
    //       gender: 'male',
    //       street: 'ljan terrasse 346',
    //       city: 'ikotun',
    //       state: 'lagos',
    //       dob: '2015-11-04',
    //       registered: '2015-11-04T22:09:36Z',
    //       phone: '66976498',
    //       userImage: '',
    //     };
    //
    //     Users.push(user);
    //     request
    //       .post('/auth/v1/login')
    //       .send({ username: 'justman', password: 'abc' })
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         res.body.should.be.a('object');
    //         res.body.Users.should.have.property('id');
    //         res.body.Users.should.have.property('firstname').eql('justin');
    //         res.body.Users.should.have.property('lastname').eql('Ikwuoma');
    //         res.body.Users.should.have.property('username').eql('justman');
    //         res.body.Users.should.have.property('email').eql('justin@gmail.com');
    //         res.body.Users.should.have.property('password').eql('abc');
    //         res.body.Users.should.have.property('userImage').eql('');
    //         res.body.should.have.property('message').eql('Success');
    //         res.body.error.should.be.eql(false);
    //         done();
    //       });
    //   });
    //
    //   it('it should not get a particular user if POST a wrong username && password', (done) => {
    //     const user = {
    //       id: 1,
    //       title: 'mr',
    //       firstname: 'justin',
    //       lastname: 'Ikwuoma',
    //       username: 'justman',
    //       password: 'abc',
    //       email: 'justin@gmail.com',
    //       gender: 'male',
    //       street: 'ljan terrasse 346',
    //       city: 'ikotun',
    //       state: 'lagos',
    //       dob: '2015-11-04',
    //       registered: '2015-11-04T22:09:36Z',
    //       phone: '66976498',
    //       userImage: '',
    //     };
    //
    //     Users.push(user);
    //     request
    //       .post('/auth/v1/login')
    //       .send({ username: 'justin', password: 'abc' })
    //       .end((err, res) => {
    //         res.should.have.status(404);
    //         res.body.should.be.a('object');
    //         res.body.message.should.be.eql('User not found');
    //         res.body.error.should.be.eql(true);
    //         done();
    //       });
    //   });
  });
  //
  /*
  * Test the /GET/ route
  */
  describe('/GET/ user', function () {
    it('it should GET all users', function (done) {

      User.create({
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
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '66976498',
        userImage: ''
      });

      request.get('/api/v1/users/').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.have.property('0');
        // res.body.should.have.deep.property('0', userObject[0]);
        done();
      });
    });

    it('it should GET a user by the given id', function (done) {

      User.create({
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
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '66976498',
        userImage: 'usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG'
      }).then(function (user) {
        console.log('--------' + user.dataValues.id + '------------------');

        request.get('/api/v1/users/' + user.dataValues.id).end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firstname').eql('somto');
          res.body.should.have.property('lastname').eql('Ikwuoma');
          res.body.should.have.property('username').eql('sommy');
          res.body.should.have.property('email').eql('somto@gmail.com');
          res.body.should.have.property('password').eql('123');
          res.body.should.have.property('userImage').eql('usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG');
          done();
        });
      });
    });

    //
    //   it('it should not GET a user by the given wrong id', (done) => {
    //     const user = {
    //       id: 12,
    //       title: 'mr',
    //       firstname: 'justin',
    //       lastname: 'Ikwuoma',
    //       username: 'justman',
    //       password: 'abc',
    //       email: 'justin@gmail.com',
    //       gender: 'male',
    //       street: 'ljan terrasse 346',
    //       city: 'ikotun',
    //       state: 'lagos',
    //       dob: '2015-11-04',
    //       registered: '2015-11-04T22:09:36Z',
    //       phone: '66976498',
    //       userImage: 'usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG',
    //     };
    //
    //     // Passing user to user model
    //     Users.push(user);
    //     request
    //       .get('/api/v1/users/14')
    //       .end((err, res) => {
    //         res.should.have.status(404);
    //         res.body.should.be.a('object');
    //         res.body.message.should.be.eql('User not found');
    //         res.body.error.should.be.eql(true);
    //         done();
    //       });
    //   });
  });
  //
  // /*
  //  * Test the /PUT/:id route
  //  */
  // describe('/PUT/:id user', () => {
  //   it('it should UPDATE a user given the id', (done) => {
  //     const user = {
  //       id: 12,
  //       title: 'mr',
  //       firstname: 'Justin',
  //       lastname: 'Ikwuoma',
  //       username: 'justman',
  //       password: 'abc',
  //       email: 'justin@gmail.com',
  //       gender: 'male',
  //       street: 'ljan terrasse 346',
  //       city: 'ikotun',
  //       state: 'lagos',
  //       dob: '2015-11-04',
  //       registered: '2015-11-04T22:09:36Z',
  //       phone: '66976498',
  //       userImage: '',
  //     };
  //
  //     // Passing user to user model
  //     Users.push(user);
  //
  //     request
  //       .put(`/api/v1/users/${user.id}`)
  //       .field('id', '1')
  //       .field('title', 'mr')
  //       .field('firstname', 'Justin')
  //       .field('lastname', 'Ikwuoma')
  //       .field('username', 'sojust')
  //       .field('password', 'abcd')
  //       .field('email', 'justin@gmail.com')
  //       .field('gender', 'male')
  //       .field('street', 'ljan terrasse 346')
  //       .field('city', 'ikotun')
  //       .field('state', 'lagos')
  //       .field('dob', '2015-11-04')
  //       .field('phone', '66976498')
  //       .attach('userImage', './testFile.png')
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql('User updated!');
  //         res.body.Users.should.have.property('title').eql('mr');
  //         res.body.Users.should.have.property('firstname').eql('Justin');
  //         res.body.Users.should.have.property('lastname').eql('Ikwuoma');
  //         res.body.Users.should.have.property('password').eql('abcd');
  //         res.body.Users.should.have.property('username').eql('sojust');
  //         res.body.Users.should.have.property('email').eql('justin@gmail.com');
  //         res.body.Users.should.have.property('userImage').eql(Users[0].userImage);
  //
  //         // delete test image file
  //         if (Users[0].userImage) {
  //           deleteFile(`./${Users[0].userImage}`);
  //         }
  //
  //         done();
  //       });
  //   });
  //
  //   it('it should not UPDATE a user given the wrong id', (done) => {
  //     const user = {
  //       id: 12,
  //       title: 'mr',
  //       firstname: 'justin',
  //       lastname: 'Ikwuoma',
  //       username: 'justman',
  //       password: 'abc',
  //       email: 'justin@gmail.com',
  //       gender: 'male',
  //       street: 'ljan terrasse 346',
  //       city: 'ikotun',
  //       state: 'lagos',
  //       dob: '2015-11-04',
  //       registered: '2015-11-04T22:09:36Z',
  //       phone: '66976498',
  //       userImage: '',
  //     };
  //
  //     // Passing user to user model
  //     Users.push(user);
  //
  //     request
  //       .put('/api/v1/users/14')
  //       .field('id', '1')
  //       .field('title', 'mr')
  //       .field('firstname', 'Justin')
  //       .field('lastname', 'Ikwuoma')
  //       .field('username', 'sojust')
  //       .field('password', 'abcd')
  //       .field('email', 'justin@gmail.com')
  //       .field('gender', 'male')
  //       .field('street', 'ljan terrasse 346')
  //       .field('city', 'ikotun')
  //       .field('state', 'lagos')
  //       .field('dob', '2015-11-04')
  //       .field('phone', '66976498')
  //       .attach('userImage', './testFile.png')
  //       .end((err, res) => {
  //         res.should.have.status(404);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql('User not found');
  //         res.body.error.should.be.eql(true);
  //         done();
  //       });
  //   });
  //
  //   it(`it should UPDATE a user given the id and
  //     maintain already existing fields and file if none is entered`, (done) => {
  //     const user = {
  //       id: 12,
  //       title: 'mr',
  //       firstname: 'Justin',
  //       lastname: 'Ikwuoma',
  //       username: 'justman',
  //       password: 'abcd',
  //       email: 'justin@gmail.com',
  //       gender: 'male',
  //       street: 'ljan terrasse 346',
  //       city: 'ikotun',
  //       state: 'lagos',
  //       dob: '2015-11-04',
  //       registered: '2015-11-04T22:09:36Z',
  //       phone: '66976498',
  //       userImage: 'usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG',
  //     };
  //
  //     // Passing user to user model
  //     Users.push(user);
  //
  //     request
  //       .put(`/api/v1/users/${user.id}`)
  //       .field('id', '1')
  //       .field('title', 'mr')
  //       .field('firstname', '')
  //       .field('lastname', '')
  //       .field('username', '')
  //       .field('password', '')
  //       .field('email', '')
  //       .field('gender', '')
  //       .field('street', '')
  //       .field('city', '')
  //       .field('state', '')
  //       .field('dob', '')
  //       .field('phone', '')
  //       .attach('userImage', '')
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql('User updated!');
  //         res.body.Users.should.have.property('title').eql('mr');
  //         res.body.Users.should.have.property('firstname').eql('Justin');
  //         res.body.Users.should.have.property('lastname').eql('Ikwuoma');
  //         res.body.Users.should.have.property('password').eql('abcd');
  //         res.body.Users.should.have.property('username').eql('justman');
  //         res.body.Users.should.have.property('email').eql('justin@gmail.com');
  //         res.body.Users.should.have.property('userImage').eql(Users[0].userImage);
  //
  //         done();
  //       });
  //   });
  //
  //   it('it should UPDATE a user given the id and replace already existing file', (done) => {
  //     const user = {
  //       id: 12,
  //       title: 'mr',
  //       firstname: 'Justin',
  //       lastname: 'Ikwuoma',
  //       username: 'justman',
  //       password: 'abc',
  //       email: 'justin@gmail.com',
  //       gender: 'male',
  //       street: 'ljan terrasse 346',
  //       city: 'ikotun',
  //       state: 'lagos',
  //       dob: '2015-11-04',
  //       registered: '2015-11-04T22:09:36Z',
  //       phone: '66976498',
  //       userImage: 'usersUploads/testFile.png',
  //     };
  //
  //     // Passing user to user model
  //     Users.push(user);
  //
  //     const filename = 'testFile.png';
  //     const src = path.join('./', filename);
  //     const destDir = path.join('./', 'usersUploads');
  //
  //     fs.access(destDir, (err) => {
  //       if (err) { fs.mkdirSync(destDir); }
  //
  //       copyFile(src, path.join(destDir, filename));
  //     });
  //
  //     request
  //       .put(`/api/v1/users/${user.id}`)
  //       .field('id', '1')
  //       .field('title', 'mr')
  //       .field('firstname', 'Justin')
  //       .field('lastname', 'Ikwuoma')
  //       .field('username', 'sojust')
  //       .field('password', 'abcd')
  //       .field('email', 'justin@gmail.com')
  //       .field('gender', 'male')
  //       .field('street', 'ljan terrasse 346')
  //       .field('city', 'ikotun')
  //       .field('state', 'lagos')
  //       .field('dob', '2015-11-04')
  //       .field('phone', '66976498')
  //       .attach('userImage', './testFile.png')
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql('User updated!');
  //         res.body.Users.should.have.property('title').eql('mr');
  //         res.body.Users.should.have.property('firstname').eql('Justin');
  //         res.body.Users.should.have.property('lastname').eql('Ikwuoma');
  //         res.body.Users.should.have.property('password').eql('abcd');
  //         res.body.Users.should.have.property('username').eql('sojust');
  //         res.body.Users.should.have.property('email').eql('justin@gmail.com');
  //         res.body.Users.should.have.property('userImage').eql(Users[0].userImage);
  //
  //         // delete test image file
  //         if (Users[0].userImage) {
  //           deleteFile(`./${Users[0].userImage}`);
  //         }
  //
  //         done();
  //       });
  //   });
  //
  //   it('it should UPDATE a user given the id when image file type not jpg/png', (done) => {
  //     const user = {
  //       id: 12,
  //       title: 'mr',
  //       firstname: 'Justin',
  //       lastname: 'Ikwuoma',
  //       username: 'justman',
  //       password: 'abc',
  //       email: 'justin@gmail.com',
  //       gender: 'male',
  //       street: 'ljan terrasse 346',
  //       city: 'ikotun',
  //       state: 'lagos',
  //       dob: '2015-11-04',
  //       registered: '2015-11-04T22:09:36Z',
  //       phone: '66976498',
  //       userImage: '',
  //     };
  //
  //     request
  //       .put(`/api/v1/users/${user.id}`)
  //       .field('id', '1')
  //       .field('title', 'mr')
  //       .field('firstname', 'Justin')
  //       .field('lastname', 'Ikwuoma')
  //       .field('username', 'justman')
  //       .field('password', 'abc')
  //       .field('email', 'justin@gmail.com')
  //       .field('gender', 'male')
  //       .field('street', 'ljan terrasse 346')
  //       .field('city', 'ikotun')
  //       .field('state', 'lagos')
  //       .field('dob', '2015-11-04')
  //       .field('phone', '66976498')
  //       .attach('userImage', './testFileType.txt')
  //       .end((err, res) => {
  //         res.should.have.status(403);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
  //         res.body.should.have.property('error').eql(true);
  //         done();
  //       });
  //   });
  //
  //   it(`it should UPDATE a user given the id
  //     when image file size is larger than 2mb`, (done) => {
  //     const user = {
  //       id: 12,
  //       title: 'mr',
  //       firstname: 'Justin',
  //       lastname: 'Ikwuoma',
  //       username: 'justman',
  //       password: 'abc',
  //       email: 'justin@gmail.com',
  //       gender: 'male',
  //       street: 'ljan terrasse 346',
  //       city: 'ikotun',
  //       state: 'lagos',
  //       dob: '2015-11-04',
  //       registered: '2015-11-04T22:09:36Z',
  //       phone: '66976498',
  //       userImage: '',
  //     };
  //
  //     request
  //       .put(`/api/v1/users/${user.id}`)
  //       .field('id', '1')
  //       .field('title', 'mr')
  //       .field('firstname', 'Justin')
  //       .field('lastname', 'Ikwuoma')
  //       .field('username', 'justman')
  //       .field('password', 'abc')
  //       .field('email', 'justin@gmail.com')
  //       .field('gender', 'male')
  //       .field('street', 'ljan terrasse 346')
  //       .field('city', 'ikotun')
  //       .field('state', 'lagos')
  //       .field('dob', '2015-11-04')
  //       .field('phone', '66976498')
  //       .attach('userImage', './testFileSize.jpg')
  //       .end((err, res) => {
  //         res.should.have.status(403);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message')
  //           .eql('file should not be more than 2mb!');
  //         res.body.should.have.property('error').eql(true);
  //         done();
  //       });
  //   });
  // });
  //
  // /*
  // * Test the /DELETE/:id route
  // */
  // describe('/DELETE/:id user', () => {
  //   it('it should DELETE a user given the id', (done) => {
  //     const user = {
  //       id: 12,
  //       title: 'mr',
  //       firstname: 'justin',
  //       lastname: 'Ikwuoma',
  //       username: 'sojust',
  //       password: 'abcd',
  //       email: 'justin@gmail.com',
  //       gender: 'male',
  //       street: 'ljan terrasse 346',
  //       city: 'ikotun',
  //       state: 'lagos',
  //       dob: '2015-11-04',
  //       registered: '2015-11-04T22:09:36Z',
  //       phone: '66976498',
  //       userImage: 'usersUploads/testFile.png',
  //     };
  //
  //     // Passing user to user model
  //     Users.push(user);
  //
  //     const filename = 'testFile.png';
  //     const src = path.join('./', filename);
  //     const destDir = path.join('./', 'usersUploads');
  //
  //     // copy image file to businessesUploads
  //     fs.access(destDir, (err) => {
  //       if (err) { fs.mkdirSync(destDir); }
  //
  //       copyFile(src, path.join(destDir, filename));
  //     });
  //
  //     request
  //       .delete(`/api/v1/users/${user.id}`)
  //       .end((err, res) => {
  //         res.should.have.status(204);
  //         res.body.should.be.a('object');
  //         done();
  //       });
  //   });
  //
  //   it('it should not DELETE a user given the wrong id', (done) => {
  //     const user = {
  //       id: 12,
  //       title: 'mr',
  //       firstname: 'justin',
  //       lastname: 'Ikwuoma',
  //       username: 'sojust',
  //       password: 'abcd',
  //       email: 'justin@gmail.com',
  //       gender: 'male',
  //       street: 'ljan terrasse 346',
  //       city: 'ikotun',
  //       state: 'lagos',
  //       dob: '2015-11-04',
  //       registered: '2015-11-04T22:09:36Z',
  //       phone: '66976498',
  //       userImage: '',
  //     };
  //
  //     // Passing user to user model
  //     Users.push(user);
  //     chai.request(app)
  //       .delete('/api/v1/users/15')
  //       .end((err, res) => {
  //         res.should.have.status(404);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql('User not found');
  //         res.body.error.should.be.eql(true);
  //         done();
  //       });
  //   });
  // });
});