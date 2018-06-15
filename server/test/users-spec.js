// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';

import Users from '../server/models/user';
import app from '../app';

chai.should();
chai.use(chaiHttp);


describe('Users', () => {
  beforeEach((done) => { // Before each test we empty the database
    Users.splice(0, Users.length);
    done();
  });

  describe('/GET user', () => {
    it('it should GET all the users', (done) => {
      chai.request(app)
        .get('/api/users')
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
    it('it should not POST a user without reviews', (done) => {
      const user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        password: 'abc',
      };

      chai.request(app)
        .post('/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(206);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Incomplete field');
          res.body.should.have.property('error').eql(true);
          done();
        });
    });

    it('it should post a business', (done) => {
      const user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        email: 'justin@gmail.com',
        password: 'abc',
      };

      chai.request(app)
        .post('/auth/signup')
        .send(user)
        .end((err, res) => {
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
    it('it should POST username && password and get the particular user ', (done) => {
      const user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        password: 'abc',
      };

      Users.push(user);
      chai.request(app)
        .post('/auth/login')
        .send({ username: 'justman', password: 'abc' })
        .end((err, res) => {
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
  * Test the /GET/ route
  */
  describe('/GET/ user', () => {

    it('it should GET all users', (done) => {
      const user = [{
        id: 12,
        name: 'justin',
        username: 'justman',
        email: 'justin@gmail.com',
        password: 'abc',
      },
      {
        id: 13,
        name: 'somto',
        username: 'sommy',
        email: 'somto@gmail.com',
        password: '123',
      }
  ];

      // Passing user to user model
      Users.push(user[0]);
      Users.push(user[1]);
      chai.request(app)
        .get(`/api/users/`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.Users.should.have.property('0');
          res.body.Users.should.have.property('1');
          res.body.Users.should.have.deep.property('0', user[0]);
          res.body.Users.should.have.deep.property('1', user[1]);
          res.body.Users.should.have.deep.property('0', user[0]).property('id').eql(user[0].id);
          res.body.Users.should.have.deep.property('1', user[1]).property('id').eql(user[1].id);
          res.body.Users.should.have.deep.property('0', user[0]).property('name').eql(user[0].name);
          res.body.Users.should.have.deep.property('1', user[1]).property('name').eql(user[1].name);
          res.body.Users.should.have.deep.property('0', user[0]).property('username').eql(user[0].username);
          res.body.Users.should.have.deep.property('1', user[1]).property('username').eql(user[1].username);
          res.body.Users.should.have.deep.property('0', user[0]).property('email').eql(user[0].email);
          res.body.Users.should.have.deep.property('1', user[1]).property('email').eql(user[1].email);
          res.body.Users.should.have.deep.property('0', user[0]).property('password').eql(user[0].password);
          res.body.Users.should.have.deep.property('1', user[1]).property('password').eql(user[1].password);
          res.body.error.should.be.eql(false);
          done();
        });
    });

    it('it should GET a user by the given id', (done) => {
      const user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        email: 'justin@gmail.com',
        password: 'abc',
      };

      // Passing user to user model
      Users.push(user);
      chai.request(app)
        .get(`/api/users/${user.id}`)
        .end((err, res) => {
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
  describe('/PUT/:id user', () => {
    it('it should UPDATE a user given the id', (done) => {
      const user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        email: 'justin@gmail.com',
        password: 'abc',
      };

      // Passing user to user model
      Users.push(user);

      chai.request(app)
        .put(`/api/users/${user.id}`)
        .send({
          id: 12,
          name: 'justin',
          username: 'sojust',
          email: 'justin@gmail.com',
          password: 'abcd'
        })
        .end((err, res) => {
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
  describe('/DELETE/:id user', () => {
    it('it should DELETE a user given the id', (done) => {
      const user = {
        id: 12,
        name: 'justin',
        username: 'justman',
        email: 'justin@gmail.com',
        password: 'abc',
      };

      // Passing user to user model
      Users.push(user);
      chai.request(app)
        .delete(`/api/users/${user.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User deleted!');
          done();
        });
    });
  });
});
