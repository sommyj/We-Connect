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
const [Business, User] = [model.Business, model.User];

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

describe('Businesses', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.destroy({ where: {}, force: true });
    Business.destroy({ where: {}, force: true }).then(() => done());
  });

  describe('/GET business', () => {
    it('it should GET all the businesses', (done) => {
      request
        .get('/v1/businesses/')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.be.eql('Businesses not found');
          done();
        });
    });
  });

  describe('/POST business', () => {
    it(`it should not CREATE a business without description, businessName, userId,
    description, location and category`, (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/businesses/')
            .set('x-access-token', res.body.token)
            .field('businessName', '')
            .field('description', '')
            .field('street', '')
            .field('city', '')
            .field('state', '')
            .field('country', '')
            .field('datefound', '')
            .field('email', '')
            .field('phone', '')
            .field('category', '')
            .attach('companyImage', './testFile.png')
            .end((err, res) => {
              res.should.have.status(206);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Incomplete fields');

              done();
            });
        });
    });

    it('it should CREATE a business', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/businesses/')
            .set('x-access-token', res.body.token)
            .field('businessName', 'Sommyj')
            .field('description', 'We produce quality products')
            .field('street', '4, badamus str')
            .field('city', 'Stoppe')
            .field('state', 'Lagos')
            .field('country', 'Nigeria')
            .field('datefound', '2015-11-04')
            .field('email', 'sommyj@gmail.com')
            .field('phone', '021316')
            .field('category', 'Production')
            .attach('companyImage', './testFile.png')
            .end((err, res) => {
              res.should.have.status(201); // 'success' status
              res.body.should.be.a('object');
              res.body.should.have.property('id').eql(res.body.id);
              res.body.should.have.property('businessName').eql('Sommyj');
              res.body.should.have.property('userId').eql(res.body.userId);
              res.body.should.have.property('description').eql('We produce quality products');
              res.body.should.have.property('state').eql('Lagos');
              res.body.should.have.property('country').eql('Nigeria');
              res.body.should.have.property('email').eql('sommyj@gmail.com');
              res.body.should.have.property('category').eql('Production');
              res.body.should.have.property('companyImage').eql(res.body.companyImage);

              // delete test image file
              if (path.resolve('./testFile.png')) {
                deleteFile(`./${res.body.companyImage}`);
              }
              done();
            });
        });
    });


    it('it should CREATE a business without image', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/businesses/')
            .set('x-access-token', res.body.token)
            .field('businessName', 'Sommyj')
            .field('description', 'We produce quality products')
            .field('street', '4, badamus str')
            .field('city', 'Stoppe')
            .field('state', 'Lagos')
            .field('country', 'Nigeria')
            .field('datefound', '2015-11-04')
            .field('email', 'sommyj@gmail.com')
            .field('phone', '021316')
            .field('category', 'Production')
            .attach('companyImage', '')
            .end((err, res) => {
              res.should.have.status(201); // 'success' status
              res.body.should.be.a('object');
              res.body.should.have.property('id').eql(res.body.id);
              res.body.should.have.property('businessName').eql('Sommyj');
              res.body.should.have.property('userId').eql(res.body.userId);
              res.body.should.have.property('description').eql('We produce quality products');
              res.body.should.have.property('state').eql('Lagos');
              res.body.should.have.property('category').eql('Production');
              res.body.should.have.property('companyImage').eql(res.body.companyImage);

              done();
            });
        });
    });

    it('it should not CREATE a business when image file type not jpg/png', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/businesses/')
            .set('x-access-token', res.body.token)
            .field('businessName', 'Sommyj')
            .field('description', 'We produce quality products')
            .field('street', '4, badamus str')
            .field('city', 'Stoppe')
            .field('state', 'Lagos')
            .field('country', 'Nigeria')
            .field('datefound', '2015-11-04')
            .field('email', 'sommyj@gmail.com')
            .field('phone', '021316')
            .field('category', 'Production')
            .attach('companyImage', './testFileType.txt')
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
              done();
            });
        });
    });

    it(`it should not CREATE a business
    when image file size is larger than 2mb`, (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/businesses/')
            .set('x-access-token', res.body.token)
            .field('businessId', '1')
            .field('businessName', 'Sommyj')
            .field('userId', '22')
            .field('description', 'We produce quality products')
            .field('location', 'lagos')
            .field('category', 'Production')
            .attach('companyImage', './testFileSize.jpg')
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('file should not be more than 2mb!');
              res.body.should.have.property('error').eql(true);
              done();
            });
        });
    });

    it('it should not CREATE a business if businessName, email, phone already exist', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          request
            .post('/v1/businesses/')
            .set('x-access-token', res.body.token)
            .field('businessName', 'Sommyj')
            .field('description', 'We produce quality products')
            .field('street', '4, badamus str')
            .field('city', 'Stoppe')
            .field('state', 'Lagos')
            .field('country', 'Nigeria')
            .field('datefound', '2015-11-04')
            .field('email', 'sommyj@gmail.com')
            .field('phone', '021316')
            .field('category', 'Production')
            .attach('companyImage', '')
            .end(() => {
              request
                .post('/v1/businesses/')
                .set('x-access-token', res.body.token)
                .field('businessName', 'Sommyj')
                .field('description', 'We produce quality products')
                .field('street', '4, badamus str')
                .field('city', 'Stoppe')
                .field('state', 'Lagos')
                .field('country', 'Nigeria')
                .field('datefound', '2015-11-04')
                .field('email', 'sommyj@gmail.com')
                .field('phone', '021316')
                .field('category', 'Production')
                .attach('companyImage', '')
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

    it('it should not CREATE a business when a token is not provided', (done) => {
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
        .attach('userImage', '')
        .end(() => {
          request
            .post('/v1/businesses/')
            .field('businessName', 'Sommyj')
            .field('description', 'We produce quality products')
            .field('street', '4, badamus str')
            .field('city', 'Stoppe')
            .field('state', 'Lagos')
            .field('country', 'Nigeria')
            .field('datefound', '2015-11-04')
            .field('email', 'sommyj@gmail.com')
            .field('phone', '021316')
            .field('category', 'Production')
            .attach('companyImage', './testFileType.txt')
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body.should.have.property('auth').eql(false);
              res.body.should.have.property('message').eql('No token provided.');
              done();
            });
        });
    });

    it('it should not CREATE a business when it fails to authenticate token.', (done) => {
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
        .attach('userImage', './testFileType.txt')
        .end(() => {
          request
            .post('/v1/businesses/')
            .set('x-access-token', 'jdkjdfskjs43354mxxnzsdz.drfsff.srfsf35324')
            .field('businessName', 'Sommyj')
            .field('description', 'We produce quality products')
            .field('street', '4, badamus str')
            .field('city', 'Stoppe')
            .field('state', 'Lagos')
            .field('country', 'Nigeria')
            .field('datefound', '2015-11-04')
            .field('email', 'sommyj@gmail.com')
            .field('phone', '021316')
            .field('category', 'Production')
            .attach('companyImage', './testFileType.txt')
            .end((err, res) => {
              res.should.have.status(500);
              res.body.should.be.a('object');
              res.body.should.have.property('auth').eql(false);
              res.body.should.have.property('message').eql('Failed to authenticate token.');
              done();
            });
        });
    });
  });

  /*
  * Test the /GET/ route
  */
  describe('/GET/ business', () => {
    it('it should GET all businesses', (done) => {
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
        dob: '2015-11-04',
        phone: '66976998',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy1',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '34165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            request
              .get('/v1/businesses')
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.property('0').property('id').eql(business.dataValues.id);
                res.body.should.have.property('0').property('businessName').eql('Sommy1');
                res.body.should.have.property('0').property('description').eql('We produce quality products');
                res.body.should.have.property('0').property('state').eql('Lagos');
                res.body.should.have.property('0').property('country').eql('Nigeria');
                res.body.should.have.property('0').property('phone').eql('34165448');
                res.body.should.have.property('0').property('userId').eql(user.dataValues.id);
                done();
              });
          });
        });
    });

    it('it should GET a business by the given id', (done) => {
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
        dob: '2015-11-04',
        phone: '66976498',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy_j',
            description: 'We produce quality products',
            street: '3 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '32165485',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            request
              .get(`/v1/businesses/${business.dataValues.id}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('businessName').eql('Sommy_j');
                res.body.should.have.property('userId').eql(user.dataValues.id);
                res.body.should.have.property('description').eql('We produce quality products');
                res.body.should.have.property('state').eql('Lagos');
                res.body.should.have.property('country').eql('Nigeria');
                res.body.should.have.property('category').eql('Production');
                res.body.should.have.property('id').eql(business.dataValues.id);
                res.body.should.have.property('companyImage').eql('');
                done();
              });
          });
        });
    });

    it('it should not GET a business by the given wrong id', (done) => {
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
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy_j',
            description: 'We produce quality products',
            street: '3 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '32165485',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then(() => {
            request
              .get('/v1/businesses/13')
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.message.should.be.eql('Business not found');
                done();
              });
          });
        });
    });

    it('it should GET a business by the given category', (done) => {
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
        dob: '2015-11-04',
        phone: '66976498',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy1',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '34165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            request
              .get('/v1/businesses/')
              .query('category=Production') // /businesses?category='Production'
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.keys('0');
                res.body.should.have.property('0');
                res.body.should.have.deep.property('0').property('id').eql(business.dataValues.id);
                res.body.should.have.deep.property('0').property('businessName').eql('Sommy1');
                res.body.should.have.deep.property('0').property('userId').eql(user.dataValues.id);
                res.body.should.have.deep.property('0').property('description').eql('We produce quality products');
                res.body.should.have.deep.property('0').property('state').eql('Lagos');
                res.body.should.have.deep.property('0').property('country').eql('Nigeria');
                res.body.should.have.deep.property('0').property('category').eql('Production');
                res.body.should.have.deep.property('0').property('phone').eql('34165448');
                res.body.should.have.deep.property('0').property('companyImage').eql('');
                done();
              });
          });
        });
    });


    it('it should not GET a business by the given wrong category', (done) => {
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
        dob: '2015-11-04',
        phone: '66976498',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy1',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '34165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then(() => {
            request
              .get('/v1/businesses')
              .query('category=Sales') // /businesses?category='Production'
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.message.should.be.eql('Businesses not found');
                done();
              });
          });
        });
    });


    it('it should GET a business by the given location', (done) => {
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
        dob: '2015-11-04',
        phone: '66976498',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy1',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '34165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            request
              .get('/v1/businesses')
              .query('location=Nigeria') // /businesses?location='Nigeria'
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.keys('0');
                res.body.should.have.property('0');
                res.body.should.have.deep.property('0').property('id').eql(business.dataValues.id);
                res.body.should.have.deep.property('0').property('businessName').eql('Sommy1');
                res.body.should.have.deep.property('0').property('userId').eql(user.dataValues.id);
                res.body.should.have.deep.property('0').property('description').eql('We produce quality products');
                res.body.should.have.deep.property('0').property('country').eql('Nigeria');
                res.body.should.have.deep.property('0').property('category').eql('Production');
                res.body.should.have.deep.property('0').property('companyImage').eql('');
                done();
              });
          });
        });
    });


    it('it should not GET a business by the given wrong location', (done) => {
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
        dob: '2015-11-04',
        phone: '66976498',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy1',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '34165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then(() => {
            request
              .get('/v1/businesses')
              .query('location=abuja') // /businesses?location='lagos'
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.message.should.be.eql('Businesses not found');
                done();
              });
          });
        });
    });


    it('it should GET a business by the given location && category', (done) => {
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
        dob: '2015-11-04',
        phone: '66976498',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy1',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '34165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business1) => {
            request
              .get('/v1/businesses')
              .query({ location: 'Nigeria', category: 'Production' }) // /businesses?location='lagos'&category='Production'
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('0');
                res.body.should.have.deep.property('0');
                res.body.should.have.deep.property('0').property('id').eql(business1.dataValues.id);
                res.body.should.have.deep.property('0').property('businessName').eql('Sommy1');
                res.body.should.have.deep.property('0').property('state').eql('Lagos');
                res.body.should.have.deep.property('0').property('country').eql('Nigeria');
                res.body.should.have.deep.property('0').property('category').eql('Production');
                res.body.should.have.deep.property('0').property('phone').eql('34165448');
                done();
              });
          });
        });
    });

    it('it should not GET a business by the given location && category', (done) => {
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
        dob: '2015-11-04',
        phone: '66976498',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy1',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '34165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then(() => {
            request
              .get('/v1/businesses')
              .query({ location: 'abuja', category: 'Production' }) // /businesses?location ='lagos'&category='Production'
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.message.should.be.eql('Businesses not found');
                done();
              });
          });
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id business', () => {
    it('it should UPDATE a business given the id', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Comango',
            description: 'We manufacture quality products',
            street: 'demfec, spotless',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '888888',
            category: 'Production',
            companyImage: '',
            userId: res.body.user.id,
          }).then((business) => {
            request
              .put(`/v1/businesses/${business.dataValues.id}`)
              .set('x-access-token', res.body.token)
              .field('businessName', 'Sommyj Enterprise')
              .field('description', 'We sale quality products')
              .field('street', '4, badamus str')
              .field('city', 'Stoppe')
              .field('state', 'port-harcourt')
              .field('country', 'Nigeria')
              .field('datefound', '2015-11-04')
              .field('email', 'sommyj@gmail.com')
              .field('phone', '021316')
              .field('category', 'Sales')
              .attach('companyImage', './testFile.png')
              .end((err, res) => {
                res.should.have.status(200); // 'success' status
                res.body.should.be.a('object');
                res.body.should.have.property('id').eql(business.dataValues.id);
                res.body.should.have.property('businessName').eql('Sommyj Enterprise');
                res.body.should.have.property('userId').eql(business.dataValues.userId);
                res.body.should.have.property('description').eql('We sale quality products');
                res.body.should.have.property('state').eql('port-harcourt');
                res.body.should.have.property('category').eql('Sales');
                res.body.should.have.property('companyImage').eql(res.body.companyImage);

                // delete test image file
                if (path.resolve('./testFile.png')) {
                  deleteFile(`./${res.body.companyImage}`);
                }
                done();
              });
          });
        });
    });


    it('it should not UPDATE a business given the wrong id', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Comango',
            description: 'We manufacture quality products',
            street: 'demfec, spotless',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '888888',
            category: 'Production',
            companyImage: '',
            userId: res.body.user.id,
          }).then(() => {
            request
              .put('/v1/businesses/12')
              .set('x-access-token', res.body.token)
              .field('businessName', 'Sommyj Enterprise')
              .field('description', 'We sale quality products')
              .field('street', '4, badamus str')
              .field('city', 'Stoppe')
              .field('state', 'port-harcourt')
              .field('country', 'Nigeria')
              .field('datefound', '2015-11-04')
              .field('email', 'sommyj@gmail.com')
              .field('phone', '021316')
              .field('category', 'Sales')
              .attach('companyImage', './testFile.png')
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Business not found');

                done();
              });
          });
        });
    });

    it(`it should UPDATE a business given the id and
    maintain already existing fields and file if none is entered`, (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Comango',
            description: 'We manufacture quality products',
            street: 'demfec, spotless',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'wecon@bfbf.b',
            phone: '888888',
            category: 'Production',
            companyImage: '',
            userId: res.body.user.id,
          }).then((business) => {
            request
              .put(`/v1/businesses/${business.dataValues.id}`)
              .set('x-access-token', res.body.token)
              .field('businessName', '')
              .field('description', '')
              .field('street', '')
              .field('city', '')
              .field('state', '')
              .field('country', '')
              .field('datefound', '')
              .field('email', '')
              .field('phone', '')
              .field('category', '')
              .attach('companyImage', '')
              .end((err, res) => {
                res.should.have.status(200); // 'success' status
                res.body.should.be.a('object');
                res.body.should.have.property('id').eql(business.dataValues.id);
                res.body.should.have.property('businessName').eql('Comango');
                res.body.should.have.property('userId').eql(res.body.userId);
                res.body.should.have.property('description').eql('We manufacture quality products');
                res.body.should.have.property('state').eql('Lagos');
                res.body.should.have.property('country').eql('Nigeria');
                res.body.should.have.property('category').eql('Production');
                res.body.should.have.property('companyImage').eql(res.body.companyImage);

                done();
              });
          });
        });
    });


    it('it should UPDATE a business given the id and replace already existing file', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Mango.com',
            description: 'We manufacture quality products',
            street: 'demfec, spotless',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'stop@bfbf.bf',
            phone: '888888453',
            category: 'Production',
            companyImage: 'businessesUploads/testFile.png',
            userId: res.body.user.id,

          }).then((business) => {
            const filename = 'testFile.png';
            const src = path.join('./', filename);
            const destDir = path.join('./', 'businessesUploads');

            fs.access(destDir, (err) => {
              if (err) { fs.mkdirSync(destDir); }

              copyFile(src, path.join(destDir, filename));
            });


            request
              .put(`/v1/businesses/${business.dataValues.id}`)
              .set('x-access-token', res.body.token)
              .field('businessName', 'Sommy Enterprise')
              .field('description', 'We sale quality products')
              .field('street', '4, badamus str')
              .field('city', 'Stoppe')
              .field('state', 'port-harcourt')
              .field('country', 'Nigeria')
              .field('datefound', '2015-11-04')
              .field('email', 'sommyj@gmail.com')
              .field('phone', '021316')
              .field('category', 'Sales')
              .attach('companyImage', './testFile.png')
              .end((err, res) => {
                res.should.have.status(200); // 'success' status
                res.body.should.be.a('object');
                res.body.should.have.property('id').eql(business.dataValues.id);
                res.body.should.have.property('businessName').eql('Sommy Enterprise');
                res.body.should.have.property('userId').eql(res.body.userId);
                res.body.should.have.property('description').eql('We sale quality products');
                res.body.should.have.property('state').eql('port-harcourt');
                res.body.should.have.property('country').eql('Nigeria');
                res.body.should.have.property('category').eql('Sales');
                res.body.should.have.property('companyImage').eql(res.body.companyImage);

                // delete test image file
                if (path.resolve('./testFile')) {
                  deleteFile(`./${res.body.companyImage}`);
                }
                done();
              });
          });
        });
    });

    it('it should not UPDATE a business when image file type not jpg/png', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Come.com',
            description: 'We use quality products',
            street: 'demzec, zpotless',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'ztop@bfbf.bf',
            phone: '888188453',
            category: 'Production',
            companyImage: 'businessesUploads/testFile.png',
            userId: res.body.user.id,
          }).then((business) => {
            request
              .put(`/v1/businesses/${business.dataValues.id}`)
              .set('x-access-token', res.body.token)
              .field('businessName', 'Sommy Enterprise')
              .field('description', 'We sale quality products')
              .field('street', '4, badamus str')
              .field('city', 'Stoppe')
              .field('state', 'port-harcourt')
              .field('country', 'Nigeria')
              .field('datefound', '2015-11-04')
              .field('email', 'sommyj@gmail.com')
              .field('phone', '021316')
              .field('category', 'Sales')
              .attach('companyImage', './testFileType.txt')
              .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
                res.body.should.have.property('error').eql(true);
                done();
              });
          });
        });
    });


    it(`it should not UPDATE a business
    when image file size is larger than 2mb`, (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Come.com',
            description: 'We use quality products',
            street: 'demzec, zpotless',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'ztop@bfbf.bf',
            phone: '888188453',
            category: 'Production',
            companyImage: 'businessesUploads/testFile.png',
            userId: res.body.user.id,
          }).then((business) => {
            request
              .put(`/v1/businesses/${business.dataValues.id}`)
              .set('x-access-token', res.body.token)
              .field('businessName', 'Sommy Limited')
              .field('description', 'We sale quality products')
              .field('street', '4, badamus str')
              .field('city', 'Stoppe')
              .field('state', 'port-harcourt')
              .field('country', 'Nigeria')
              .field('datefound', '2015-11-04')
              .field('email', 'sommyj@gmail.com')
              .field('phone', '02131684')
              .field('category', 'Sales')
              .attach('companyImage', './testFileSize.jpg')
              .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('file should not be more than 2mb!');
                res.body.should.have.property('error').eql(true);
                done();
              });
          });
        });
    });

    it('it should not UPDATE a business if businessName, email, phone already exist', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Sommyj',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'sommyj@gmail.com',
            phone: '021316',
            category: 'Production',
            companyImage: '',
            userId: res.body.user.id,
          }).then(() => {
            Business.create({
              businessName: 'Sommy1',
              description: 'We produce quality products',
              street: '4 jvjvkjvj, kfkjfj',
              city: 'Sinner',
              state: 'Lagos',
              country: 'Nigeria',
              datefound: '2015-11-04',
              email: 'sommy@gmail.com',
              phone: '021316445',
              category: 'Production',
              companyImage: '',
              userId: res.body.user.id,
            }).then((business) => {
              request
                .put(`/v1/businesses/${business.dataValues.id}`)
                .set('x-access-token', res.body.token)
                .field('businessName', 'Sommyj')
                .field('description', 'We produce quality products')
                .field('street', '4, badamus str')
                .field('city', 'Stoppe')
                .field('state', 'Lagos')
                .field('country', 'Nigeria')
                .field('datefound', '2015-11-04')
                .field('email', 'sommyj@gmail.com')
                .field('phone', '021316')
                .field('category', 'Production')
                .attach('companyImage', './testFile.png')
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
    });

    it('it should not UPDATE a business when a token is not provided', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Sommyj',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'sommyj@gmail.com',
            phone: '021316',
            category: 'Production',
            companyImage: '',
            userId: res.body.user.id,
          }).then((business) => {
            request
              .put(`/v1/businesses/${business.dataValues.id}`)
              .field('businessName', 'Sommy1')
              .field('userId', 0)
              .field('description', 'We produce quality products')
              .field('street', '4, badamus str')
              .field('city', 'Stoppe')
              .field('state', 'Lagos')
              .field('country', 'Nigeria')
              .field('datefound', '2015-11-04')
              .field('email', 'sommy@gmail.com')
              .field('phone', '02131645')
              .field('category', 'Production')
              .attach('companyImage', './testFile.png')
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('auth').eql(false);
                res.body.should.have.property('message').eql('No token provided.');
                done();
              });
          });
        });
    });

    it('it should not UPDATE a business when it fails to authenticate token.', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Sommyj',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'sommyj@gmail.com',
            phone: '021316',
            category: 'Production',
            companyImage: '',
            userId: res.body.user.id,
          }).then((business) => {
            request
              .put(`/v1/businesses/${business.dataValues.id}`)
              .set('x-access-token', 'nferf.edfef.34342')
              .field('businessName', 'Sommy1')
              .field('description', 'We produce quality products')
              .field('street', '4, badamus str')
              .field('city', 'Stoppe')
              .field('state', 'Lagos')
              .field('country', 'Nigeria')
              .field('datefound', '2015-11-04')
              .field('email', 'sommy@gmail.com')
              .field('phone', '02131645')
              .field('category', 'Production')
              .attach('companyImage', './testFile.png')
              .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('auth').eql(false);
                res.body.should.have.property('message').eql('Failed to authenticate token.');
                done();
              });
          });
        });
    });

    it('it should not UPDATE a business when user is unauthorize.', (done) => {
      request
        .post('/auth/v1/signup')
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
        .field('phone', '669764981')
        .attach('userImage', '')
        .end((err, res1) => {
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
            .attach('userImage', '')
            .end((err, res2) => {
              Business.create({
                businessName: 'Sommyj',
                description: 'We produce quality products',
                street: '4 jvjvkjvj, kfkjfj',
                city: 'Sinner',
                state: 'Lagos',
                country: 'Nigeria',
                datefound: '2015-11-04',
                email: 'sommyj@gmail.com',
                phone: '021316',
                category: 'Production',
                companyImage: '',
                userId: res2.body.user.id,
              }).then((business) => {
                request
                  .put(`/v1/businesses/${business.dataValues.id}`)
                  .set('x-access-token', res1.body.token)
                  .field('businessName', 'Sommy1')
                  .field('description', 'We produce quality products')
                  .field('street', '4, badamus str')
                  .field('city', 'Stoppe')
                  .field('state', 'Lagos')
                  .field('country', 'Nigeria')
                  .field('datefound', '2015-11-04')
                  .field('email', 'sommy@gmail.com')
                  .field('phone', '02131645')
                  .field('category', 'Production')
                  .attach('companyImage', './testFile.png')
                  .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('auth').eql(false);
                    res.body.should.have.property('message').eql('User not allowed');
                    done();
                  });
              });
            });
        });
    });
  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id business', () => {
    it('it should not DELETE a business given the wrong id', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Some1.com',
            description: 'We use quality products',
            street: 'demzec, zpotless',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'ztod1@bfbf.bf',
            phone: '881884530',
            category: 'Production',
            companyImage: 'businessesUploads/testFile.png',
            userId: res.body.user.id,
          }).then(() => {
            request
              .delete('/v1/businesses/13')
              .set('x-access-token', res.body.token)
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Business not found');
                done();
              });
          });
        });
    });

    it('it should DELETE a business given the id', (done) => {
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
        .attach('userImage', '')
        .end((err, res) => {
          Business.create({
            businessName: 'Some.com',
            description: 'We use quality products',
            street: 'demzec, zpotless',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'ztod@bfbf.bf',
            phone: '88188453',
            category: 'Production',
            companyImage: 'businessesUploads/testFile.png',
            userId: res.body.user.id,
          }).then((business) => {
            const filename = 'testFile.png';
            const src = path.join('./', filename);
            const destDir = path.join('./', 'businessesUploads');

            // copy image file to businessesUploads
            fs.access(destDir, (err) => {
              if (err) { fs.mkdirSync(destDir); }

              copyFile(src, path.join(destDir, filename));
            });

            request
              .delete(`/v1/businesses/${business.dataValues.id}`)
              .set('x-access-token', res.body.token)
              .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.a('object');
                done();
              });
          });
        });
    });
  });
});
