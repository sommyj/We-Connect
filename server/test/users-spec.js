// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
// Require the dev-dependencies
import chai from 'chai';
import supertest from 'supertest';
import fs from 'file-system';
import path from 'path';
import chaiHttp from 'chai-http';

import app from '../app';
import model from '../server/models';


chai.should();
chai.use(chaiHttp);
const request = supertest(app);
const [User] = [model.User];

/**
 * copy file from a directory to another
 * @param {String} src The source you are copying from.
 * @param {String} dest The destination you are copying to.
 * @returns {void} nothing.
 */
const copyFile = (src, dest) => {
  const readStream = fs.createReadStream(src);

  readStream.pipe(fs.createWriteStream(dest));
};

/**
 * delete a file
 * @param {String} targetPath The part to delete from
 * @returns {void} nothing.
 */
const deleteFile = (targetPath) => {
  fs.unlink(targetPath, (err) => {
    if (err) throw err;
  });
};

describe('Users', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.destroy({ where: {}, force: true }).then(() => done());
  });

  describe('/GET user', () => {
    it('it should GET all the users', (done) => {
      request
        .get('/api/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/POST user', () => {
    it(`it should not CREATE a user without firstname, lastname, username, password,
     email, gender, street, city, state, dob, phone`, (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', '')
        .field('lastname', '')
        .field('username', '')
        .field('password', '')
        .field('email', '')
        .field('gender', '')
        .field('street', '')
        .field('city', '')
        .field('state', '')
        .field('dob', '')
        .field('phone', '')
        .attach('userImage', './testFile.png')
        .end((err, res) => {
          res.should.have.status(206);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Incomplete field');
          done();
        });
    });

    it('it should CREATE a user', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman')
        .field('password', 'abc')
        .field('email', 'justin@gmail.com')
        .field('gender', 'male')
        .field('street', 'ljan terrasse 346')
        .field('city', 'ikotun')
        .field('state', 'lagos')
        .field('country', 'Nigeria')
        .field('dob', '2015-11-04')
        .field('phone', '66976498')
        .attach('userImage', './testFile.png')

        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.user.should.have.property('id').eql(res.body.user.id);
          res.body.user.should.have.property('firstname').eql('Justin');
          res.body.user.should.have.property('lastname').eql('Ikwuoma');
          res.body.user.should.have.property('username').eql('justman');
          res.body.user.should.have.property('email').eql('justin@gmail.com');
          res.body.user.should.have.property('password').eql(res.body.user.password);
          res.body.user.should.have.property('gender').eql('male');
          res.body.user.should.have.property('street').eql('ljan terrasse 346');
          res.body.user.should.have.property('city').eql('ikotun');
          res.body.user.should.have.property('userImage').eql(res.body.user.userImage);
          res.body.should.have.property('auth').eql(true);
          res.body.should.have.property('token').eql(res.body.token);

          // delete test image file
          if (path.resolve('./testFile.png')) {
            deleteFile(`./${res.body.user.userImage}`);
          }
          done();
        });
    });

    it('it should CREATE a user without image', (done) => {
      request
        .post('/auth/v1/signup')
        .field('id', '1')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman1')
        .field('password', 'abc')
        .field('email', 'justin1@gmail.com')
        .field('gender', 'male')
        .field('street', 'ljan terrasse 346')
        .field('city', 'ikotun')
        .field('state', 'lagos')
        .field('country', 'Nigeria')
        .field('dob', '2015-11-04')
        .field('phone', '669796498')
        .attach('userImage', '')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.user.should.have.property('id').eql(res.body.user.id);
          res.body.user.should.have.property('firstname').eql('Justin');
          res.body.user.should.have.property('lastname').eql('Ikwuoma');
          res.body.user.should.have.property('username').eql('justman1');
          res.body.user.should.have.property('email').eql('justin1@gmail.com');
          res.body.user.should.have.property('password').eql(res.body.user.password);
          res.body.user.should.have.property('gender').eql('male');
          res.body.user.should.have.property('street').eql('ljan terrasse 346');
          res.body.user.should.have.property('city').eql('ikotun');
          res.body.user.should.have.property('country').eql('Nigeria');
          res.body.user.should.have.property('userImage').eql('');
          res.body.should.have.property('auth').eql(true);
          res.body.should.have.property('token').eql(res.body.token);

          done();
        });
    });


    it('it should not CREATE a user when image file type not jpg/png', (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman2')
        .field('password', 'abc')
        .field('email', 'justin2@gmail.com')
        .field('gender', 'male')
        .field('street', 'ljan terrasse 346')
        .field('city', 'ikotun')
        .field('state', 'lagos')
        .field('country', 'Nigeria')
        .field('dob', '2015-11-04')
        .field('phone', '166976498')
        .attach('userImage', './testFileType.txt')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
          res.body.should.have.property('error').eql(true);
          done();
        });
    });

    it(`it should not CREATE a user
      when image file size is larger than 2mb`, (done) => {
      request
        .post('/auth/v1/signup')
        .field('title', 'mr')
        .field('firstname', 'Justin')
        .field('lastname', 'Ikwuoma')
        .field('username', 'justman3')
        .field('password', 'abc')
        .field('email', 'justin3@gmail.com')
        .field('gender', 'male')
        .field('street', 'ljan terrasse 346')
        .field('city', 'ikotun')
        .field('state', 'lagos')
        .field('country', 'Nigeria')
        .field('dob', '2015-11-04')
        .field('phone', '366976498')
        .attach('userImage', './testFileSize.jpg')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message')
            .eql('file should not be more than 2mb!');
          res.body.should.have.property('error').eql(true);
          done();
        });
    });

    it('it should not get a particular user if POST a wrong username && password', (done) => {
      User.create({
        title: 'mr',
        firstname: 'justin',
        lastname: 'Ikwuoma',
        username: 'justman5',
        password: 'abc',
        email: 'justin5@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: '2015-11-04',
        phone: '566976498',
        userImage: ''
      });

      request
        .post('/auth/v1/login')
        .send({ username: 'just', password: 'abc' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.message.should.be.eql('User not found');
          done();
        });
    });

    it('it should POST username && password and get the particular user ', (done) => {
      User.create({
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman4',
        password: 'abc',
        email: 'justin4@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: '2015-11-04',
        phone: '4466976498',
        userImage: ''
      }).then(() => {
        request
          .post('/auth/v1/login')
          .send({ username: 'justman4', password: 'abc' })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.user.should.have.property('id');
            res.body.user.should.have.property('firstname').eql('Justin');
            res.body.user.should.have.property('lastname').eql('Ikwuoma');
            res.body.user.should.have.property('username').eql('justman4');
            res.body.user.should.have.property('email').eql('justin4@gmail.com');
            res.body.user.should.have.property('password').eql(res.body.user.password);
            res.body.user.should.have.property('userImage').eql('');
            res.body.should.have.property('auth').eql(true);
            res.body.should.have.property('token').eql(res.body.token);
            done();
          });
      });
    });

    it('it should not CREATE a user if username, email, phone already exist', (done) => {
      User.create({
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman4',
        password: 'abc',
        email: 'justin4@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: '2015-11-04',
        phone: '4466976498',
        userImage: ''
      }).then(() => {
        request
          .post('/auth/v1/signup')
          .field('id', '1')
          .field('title', 'mr')
          .field('firstname', 'Justin')
          .field('lastname', 'Ikwuoma')
          .field('username', 'justman4')
          .field('password', 'abc')
          .field('email', 'justin1@gmail.com')
          .field('gender', 'male')
          .field('street', 'ljan terrasse 346')
          .field('city', 'ikotun')
          .field('state', 'lagos')
          .field('country', 'Nigeria')
          .field('dob', '2015-11-04')
          .field('phone', '669796498')
          .attach('userImage', '')
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.should.have.property('name').eql('SequelizeUniqueConstraintError');
            done();
          });
      });
    });
  });

  /*
  * Test the /GET/ route
  */
  describe('/GET/ user', () => {
    it('it should GET all users', (done) => {
      User.create({
        title: 'mr',
        firstname: 'Somto',
        lastname: 'Ikwuoma',
        username: 'sommy',
        password: '123',
        email: 'somto@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'Ikotun',
        state: 'Lagos',
        country: 'Nigeria',
        dob: '2015-11-04',
        phone: '66976498',
        userImage: ''
      }).then((user) => {
        request
          .get('/api/v1/users')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.property('0');
            res.body.should.have.deep.property('0').property('id').eql(user.dataValues.id);
            res.body.should.have.deep.property('0').property('firstname').eql('Somto');
            res.body.should.have.deep.property('0').property('lastname').eql('Ikwuoma');
            res.body.should.have.deep.property('0').property('username').eql('sommy');
            res.body.should.have.deep.property('0').property('gender').eql('male');
            res.body.should.have.deep.property('0').property('email').eql('somto@gmail.com');
            res.body.should.have.deep.property('0').property('state').eql('Lagos');
            res.body.should.have.deep.property('0').property('country').eql('Nigeria');
            done();
          });
      });
    });

    it('it should GET a user by the given id', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'sommy1',
        password: '123',
        email: 'somto1@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '669764981',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          request
            .get(`/api/v1/users/${user.dataValues.id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('firstname').eql('somto');
              res.body.should.have.property('lastname').eql('Ikwuoma');
              res.body.should.have.property('username').eql('sommy1');
              res.body.should.have.property('email').eql('somto1@gmail.com');
              res.body.should.have.property('password').eql(res.body.password);
              res.body.should.have.property('userImage').eql('usersUploads/testFile.png');

              done();
            });
        });
    });


    it('it should not GET a user by the given wrong id', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'sommy2',
        password: '123',
        email: 'somto2@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '669764982',
        userImage: 'usersUploads/testFile.png'
      });

      request
        .get('/api/v1/users/14')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.message.should.be.eql('User not found');
          done();
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id user', () => {
    it('it should UPDATE a user given the id', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'sommy3',
        password: '123',
        email: 'somto3@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: '2015-11-04',
        phone: '669764983',
        userImage: ''
      }).then((user) => {
        request
          .put(`/api/v1/users/${user.dataValues.id}`)
          .field('title', 'mr')
          .field('firstname', 'Justin')
          .field('lastname', 'Ikwuoma')
          .field('username', 'sojust')
          .field('password', 'abcd')
          .field('email', 'justin@gmail.com')
          .field('gender', 'male')
          .field('street', 'ljan terrasse 346')
          .field('city', 'ikotun')
          .field('state', 'lagos')
          .field('dob', '2015-11-04')
          .field('phone', '669764984')
          .attach('userImage', './testFile.png')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title').eql('mr');
            res.body.should.have.property('firstname').eql('Justin');
            res.body.should.have.property('lastname').eql('Ikwuoma');
            res.body.should.have.property('password').eql(res.body.password);
            res.body.should.have.property('username').eql('sojust');
            res.body.should.have.property('email').eql('justin@gmail.com');
            res.body.should.have.property('userImage').eql(res.body.userImage);

            // delete test image file
            if (path.resolve('./testFile.png')) {
              deleteFile(`./${res.body.userImage}`);
            }

            done();
          });
      });
    });

    it('it should not UPDATE a user given the wrong id', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'sommy5',
        password: '123',
        email: 'somto5@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '669764985',
        userImage: ''
      }).then(() => {
        request
          .put('/api/v1/users/14')
          .field('title', 'mr')
          .field('firstname', 'Justin')
          .field('lastname', 'Ikwuoma')
          .field('username', 'sojust')
          .field('password', 'abcd')
          .field('email', 'sojust@gmail.com')
          .field('gender', 'male')
          .field('street', 'ljan terrasse 346')
          .field('city', 'ikotun')
          .field('state', 'lagos')
          .field('country', 'Nigeria')
          .field('dob', '2015-11-04')
          .field('phone', '66976498')
          .attach('userImage', './testFile.png')
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('User not found');
            done();
          });
      });
    });

    it(`it should UPDATE a user given the id and
      maintain already existing fields and file if none is entered`, (done) => {
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
      }).then((user) => {
        request
          .put(`/api/v1/users/${user.dataValues.id}`)
          .field('title', '')
          .field('firstname', '')
          .field('lastname', '')
          .field('username', '')
          .field('password', '')
          .field('email', '')
          .field('gender', '')
          .field('street', '')
          .field('city', '')
          .field('state', '')
          .field('country', '')
          .field('dob', '')
          .field('phone', '')
          .attach('userImage', '')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title').eql('mr');
            res.body.should.have.property('firstname').eql('somto');
            res.body.should.have.property('lastname').eql('Ikwuoma');
            res.body.should.have.property('password').eql(res.body.password);
            res.body.should.have.property('username').eql('sommy');
            res.body.should.have.property('email').eql('somto@gmail.com');
            res.body.should.have.property('userImage').eql('usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG');
            done();
          });
      });
    });

    it('it should UPDATE a user given the id and replace already existing file', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'sommmy',
        password: '123',
        email: 'sommto@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '66976490',
        userImage: 'usersUploads/testFile.png'
      }).then((user) => {
        const filename = 'testFile.png';
        const src = path.join('./', filename);
        const destDir = path.join('./', 'usersUploads');

        fs.access(destDir, (err) => {
          if (err) { fs.mkdirSync(destDir); }

          copyFile(src, path.join(destDir, filename));
        });

        request
          .put(`/api/v1/users/${user.dataValues.id}`)
          .field('id', '1')
          .field('title', 'mr')
          .field('firstname', 'Justin')
          .field('lastname', 'Ikwuoma')
          .field('username', 'sojust')
          .field('password', 'abcd')
          .field('email', 'justin@gmail.com')
          .field('gender', 'male')
          .field('street', 'ljan terrasse 346')
          .field('city', 'ikotun')
          .field('state', 'lagos')
          .field('dob', '2015-11-04')
          .field('phone', '66976498')
          .attach('userImage', './testFile.png')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title').eql('mr');
            res.body.should.have.property('firstname').eql('Justin');
            res.body.should.have.property('lastname').eql('Ikwuoma');
            res.body.should.have.property('password').eql(res.body.password);
            res.body.should.have.property('username').eql('sojust');
            res.body.should.have.property('email').eql('justin@gmail.com');
            res.body.should.have.property('userImage').eql(res.body.userImage);

            // delete test image file
            if (path.resolve('./testFile.png')) {
              deleteFile(`./${res.body.userImage}`);
            }

            done();
          });
      });
    });

    it('it should not UPDATE a user given the id when image file type not jpg/png', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'sommmmy',
        password: '123',
        email: 'sommmto@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '066976498',
        userImage: ''
      }).then((user) => {
        request
          .put(`/api/v1/users/${user.dataValues.id}`)
          .field('title', 'mr')
          .field('firstname', 'Justin')
          .field('lastname', 'Ikwuoma')
          .field('username', 'justman0')
          .field('password', 'abc')
          .field('email', 'justin0@gmail.com')
          .field('gender', 'male')
          .field('street', 'ljan terrasse 346')
          .field('city', 'ikotun')
          .field('state', 'lagos')
          .field('dob', '2015-11-04')
          .field('phone', '669764988')
          .attach('userImage', './testFileType.txt')
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
            res.body.should.have.property('error').eql(true);
            done();
          });
      });
    });

    it(`it should not UPDATE a user given the id
      when image file size is larger than 2mb`, (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'sommyy',
        password: '123',
        email: 'somtto@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '0066976498',
        userImage: ''
      })
        .then((user) => {
          request
            .put(`/api/v1/users/${user.dataValues.id}`)
            .field('title', 'mr')
            .field('firstname', 'Justin')
            .field('lastname', 'Ikwuoma')
            .field('username', 'justman')
            .field('password', 'abc')
            .field('email', 'justin@gmail.com')
            .field('gender', 'male')
            .field('street', 'ljan terrasse 346')
            .field('city', 'ikotun')
            .field('state', 'lagos')
            .field('dob', '2015-11-04')
            .field('phone', '366976498')
            .attach('userImage', './testFileSize.jpg')
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message')
                .eql('file should not be more than 2mb!');
              res.body.should.have.property('error').eql(true);
              done();
            });
        });
    });

    it('it should not UPDATE a user if username, email, phone already exist', (done) => {
      User.create({
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman4',
        password: 'abc',
        email: 'justin4@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: '2015-11-04',
        phone: '4466976498',
        userImage: ''
      });

      User.create({
        title: 'mr',
        firstname: 'Justin',
        lastname: 'Ikwuoma',
        username: 'justman1',
        password: 'abc',
        email: 'justin5@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: '2015-11-04',
        phone: '5466976498',
        userImage: ''
      }).then((user) => {
        request
          .put(`/api/v1/users/${user.dataValues.id}`)
          .field('title', 'mr')
          .field('firstname', 'Justin')
          .field('lastname', 'Ikwuoma')
          .field('username', 'justman4')
          .field('password', 'abc')
          .field('email', 'justin4@gmail.com')
          .field('gender', 'male')
          .field('street', 'ljan terrasse 346')
          .field('city', 'ikotun')
          .field('state', 'lagos')
          .field('country', 'Nigeria')
          .field('dob', '2015-11-04')
          .field('phone', '4466976498')
          .attach('userImage', '')
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.should.have.property('name').eql('SequelizeUniqueConstraintError');
            done();
          });
      });
    });
  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id user', () => {
    it('it should not DELETE a user given the wrong id', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'sommyyy',
        password: '123',
        email: 'somtoy@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '669761498',
        userImage: ''
      });

      request
        .delete('/api/v1/users/15')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User not found');
          done();
        });
    });

    it('it should DELETE a user given the id', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'ssommy',
        password: '123',
        email: 'ssomto@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: new Date('2015-11-04'),
        phone: '466976498',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          const filename = 'testFile.png';
          const src = path.join('./', filename);
          const destDir = path.join('./', 'usersUploads');

          // copy image file to businessesUploads
          fs.access(destDir, (err) => {
            if (err) { fs.mkdirSync(destDir); }

            copyFile(src, path.join(destDir, filename));
          });

          request
            .delete(`/api/v1/users/${user.dataValues.id}`)
            .end((err, res) => {
              res.should.have.status(204);
              res.body.should.be.a('object');
              done();
            });
        });
    });
  });
});
