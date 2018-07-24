// Require the dev-dependencies
import chai from 'chai';
import supertest from 'supertest';
import fs from 'file-system';
import path from 'path';

import Users from '../server/models/user';
import app from '../app';

chai.should();
const request = supertest(app);

//copy file from a directory to another
function copyFile(src, dest) {

  let readStream = fs.createReadStream(src);

  readStream.once('error', (err) => {
    console.log(err);
  });

  readStream.once('end', () => {
    console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(dest));
}

describe('Users', () => {
  beforeEach((done) => { // Before each test we empty the database
    Users.splice(0, Users.length);
    done();
  });

  describe('/GET user', () => {
    it('it should GET all the users', (done) => {
      chai.request(app)
        .get('/api/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.Users.should.be.a('array');
          res.body.Users.length.should.be.eql(0);
          res.body.error.should.be.eql(false);
          done();
        });
    });
  });

  describe('/POST user', () => {
    it(`it should not POST a user without firstname, lastname, username, password,
     email, gender, street, city, state, dob, phone`, (done) => {

      request
        .post('/auth/v1/signup')
        .field('id', '1')
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
          res.body.should.have.property('error').eql(true);
          done();
        });
    });

    it('it should post a user', (done) => {

      request
        .post('/auth/v1/signup')
        .field('id', '1')
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
        .field('phone', '66976498')
        .attach('userImage', './testFile.png')
        .end((err, res) => {
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
          res.body.Users.should.have.property('userImage').eql(Users[0].userImage);
          res.body.should.have.property('message').eql('Success');
          res.body.should.have.property('error').eql(false);

          //delete test image file
          if (Users[0].userImage) {
            fs.unlink(`./${Users[0].userImage}`, (err) => {
              if (err) new Error('oohs something went wrong');
            });
          }

          done();
        });
    });

    it('it should post a user without image', (done) => {

      request
        .post('/auth/v1/signup')
        .field('id', '1')
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
        .field('phone', '66976498')
        .attach('userImage', '')
        .end((err, res) => {
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

    it('it should POST username && password and get the particular user ', (done) => {
      const user = {
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
        userImage: '',
      };

      Users.push(user);
      request
        .post('/auth/v1/login')
        .send({ username: 'justman', password: 'abc' })
        .end((err, res) => {
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

    it('it should not get a particular user if POST a wrong username && password', (done) => {
      const user = {
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
        userImage: '',
      };

      Users.push(user);
      request
        .post('/auth/v1/login')
        .send({ username: 'justin', password: 'abc' })
        .end((err, res) => {
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
  describe('/GET/ user', () => {
    it('it should GET all users', (done) => {
      const user = [{
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
        userImage: '',
      },
      {
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
        userImage: '',
      }
      ];

      // Passing user to user model
      Users.push(user[0]);
      Users.push(user[1]);
      request
        .get('/api/v1/users/')
        .end((err, res) => {
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

    it('it should GET a user by the given id', (done) => {
      const user = {
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
        userImage: 'usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG',
      };

      // Passing user to user model
      Users.push(user);
      request
        .get(`/api/v1/users/${user.id}`)
        .end((err, res) => {
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


    it('it should not GET a user by the given wrong id', (done) => {
      const user = {
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
        userImage: 'usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG',
      };

      // Passing user to user model
      Users.push(user);
      request
        .get('/api/v1/users/14')
        .end((err, res) => {
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
  describe('/PUT/:id user', () => {
    it('it should UPDATE a user given the id', (done) => {
      const user = {
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
        userImage: '',
      };

      // Passing user to user model
      Users.push(user);

      request
        .put(`/api/v1/users/${user.id}`)
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
          res.body.should.have.property('message').eql('User updated!');
          res.body.Users.should.have.property('title').eql('mr');
          res.body.Users.should.have.property('firstname').eql('Justin');
          res.body.Users.should.have.property('lastname').eql('Ikwuoma');
          res.body.Users.should.have.property('password').eql('abcd');
          res.body.Users.should.have.property('username').eql('sojust');
          res.body.Users.should.have.property('email').eql('justin@gmail.com');
          res.body.Users.should.have.property('userImage').eql(Users[0].userImage);

          //delete test image file
          if (Users[0].userImage) {
            fs.unlink(`./${Users[0].userImage}`, (err) => {
              if (err) new Error('oohs something went wrong');
            });
          }

          done();
        });
    });

    it('it should not UPDATE a user given the wrong id', (done) => {
      const user = {
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
        userImage: '',
      };

      // Passing user to user model
      Users.push(user);

      request
        .put('/api/v1/users/14')
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
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User not found');
          res.body.error.should.be.eql(true);
          done();
        });
    });

    it(`it should UPDATE a user given the id and
      maintain already existing fields and file if none is entered`, (done) => {
      const user = {
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
        userImage: 'usersUploads/2018-07-23T16:04:36.226Zpassport.resized.JPG',
      };

      // Passing user to user model
      Users.push(user);

      request
        .put(`/api/v1/users/${user.id}`)
        .field('id', '1')
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
        .attach('userImage', '')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User updated!');
          res.body.Users.should.have.property('title').eql('mr');
          res.body.Users.should.have.property('firstname').eql('Justin');
          res.body.Users.should.have.property('lastname').eql('Ikwuoma');
          res.body.Users.should.have.property('password').eql('abcd');
          res.body.Users.should.have.property('username').eql('justman');
          res.body.Users.should.have.property('email').eql('justin@gmail.com');
          res.body.Users.should.have.property('userImage').eql(Users[0].userImage);

          done();
        });
    });

    it('it should UPDATE a user given the id and replace already existing file', (done) => {
      const user = {
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
        userImage: 'usersUploads/testFile.png',
      };

      // Passing user to user model
      Users.push(user);

      let filename = 'testFile.png';
      let src = path.join('./', filename);
      let destDir = path.join('./', 'usersUploads');

      fs.access(destDir, (err) => {
        if(err)
          fs.mkdirSync(destDir);

        copyFile(src, path.join(destDir, filename));
      });

      request
        .put(`/api/v1/users/${user.id}`)
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
          res.body.should.have.property('message').eql('User updated!');
          res.body.Users.should.have.property('title').eql('mr');
          res.body.Users.should.have.property('firstname').eql('Justin');
          res.body.Users.should.have.property('lastname').eql('Ikwuoma');
          res.body.Users.should.have.property('password').eql('abcd');
          res.body.Users.should.have.property('username').eql('sojust');
          res.body.Users.should.have.property('email').eql('justin@gmail.com');
          res.body.Users.should.have.property('userImage').eql(Users[0].userImage);

          //delete test image file
          if (Users[0].userImage) {
            fs.unlink(`./${Users[0].userImage}`, (err) => {
              if (err) new Error('oohs something went wrong');
            });
          }

          done();
        });
    });

  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id user', () => {
    it('it should DELETE a user given the id', (done) => {
      const user = {
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
        userImage: 'usersUploads/testFile.png',
      };

      // Passing user to user model
      Users.push(user);

      let filename = 'testFile.png';
      let src = path.join('./', filename);
      let destDir = path.join('./', 'usersUploads');

      //copy image file to businessesUploads
      fs.access(destDir, (err) => {
        if(err)
          fs.mkdirSync(destDir);

        copyFile(src, path.join(destDir, filename));
      });

      request
        .delete(`/api/v1/users/${user.id}`)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          done();
        });
    });

    it('it should not DELETE a user given the wrong id', (done) => {
      const user = {
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
        userImage: '',
      };

      // Passing user to user model
      Users.push(user);
      chai.request(app)
        .delete('/api/v1/users/15')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User not found');
          res.body.error.should.be.eql(true);
          done();
        });
    });
  });

  describe('connect.static()', function(){
    it('should serve static files', function(done){

      let filename = 'testFile.png';
      let src = path.join('./', filename);
      let destDir = path.join('./', 'usersUploads');

      // copy image file to businessesUploads
      fs.access(destDir, (err) => {
        if(err)
          fs.mkdirSync(destDir);

        copyFile(src, path.join(destDir, filename));
      });

      request
      .get('/usersUploads/testFile.png')
      .end((err, res) => {
        //delete test image file
        if (path.resolve(`./usersUploads/testFile.png`)) {
          fs.unlink(`./usersUploads/testFile.png`, (err) => {
            if (err) new Error('oohs something went wrong');
          });
        }
        done();
      });
    })
  });

});
