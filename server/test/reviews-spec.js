// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
// Require the dev-dependencies
import chai from 'chai';
import supertest from 'supertest';

import model from '../server/models';
import app from '../app';


chai.should();
const request = supertest(app);
const [User, Business, Review] = [model.User, model.Business, model.Review];


describe('Reviews', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.destroy({ where: {}, force: true });
    Business.destroy({ where: {}, force: true });
    Review.destroy({ where: {}, force: true }).then(() => done());
  });

  describe('/GET review', () => {
    it('it should GET empty reviews', (done) => {
      request
        .get('/v1/businesses/1/reviews')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
    it('it should GET all the reviews', (done) => {
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
        phone: '166976498',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Sommy',
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
            Review.create({
              response: 'come',
              userId: user.dataValues.id,
              businessId: business.dataValues.id,
            }).then(() => {
              request
                .get(`/v1/businesses/${business.dataValues.id}/reviews`)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.should.have.deep.property('0').property('response').eql('come');
                  res.body.should.have.deep.property('0').property('userId').eql(user.dataValues.id);
                  res.body.should.have.deep.property('0').property('businessId').eql(business.dataValues.id);
                  done();
                });
            });
          });
        });
    });


    it('it should GET empty reviews if reviews does not exists', (done) => {
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
            email: 'wecon1@bfbf.b',
            phone: '134165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            Review.create({
              response: 1,
              userId: user.dataValues.id,
              businessId: business.dataValues.id,
            }).then(() => {
              request
                .get('/v1/businesses/1/reviews')
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
                  done();
                });
            });
          });
        });
    });
  });

  describe('/POST review', () => {
    it('it should not POST a review without a response', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'zuma',
        password: 'zumarock',
        email: 'rock@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: '2015-11-04',
        phone: '00110011',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Rocky nation',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'bigups@bfbf.b',
            phone: '111198728',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            request
              .post(`/v1/businesses/${business.dataValues.id}/reviews`)
              .send({
                response: '',
                userId: `${user.dataValues.id}`,
                businessId: `${business.dataValues.id}`
              })
              .end((err, res) => {
                res.should.have.status(206);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Incomplete field');
                done();
              });
          });
        });
    });

    it('it should post a review', (done) => {
      User.create({
        title: 'mr',
        firstname: 'somto',
        lastname: 'Ikwuoma',
        username: 'zuma',
        password: 'zumarock',
        email: 'rock@gmail.com',
        gender: 'male',
        street: 'ljan terrasse 346',
        city: 'ikotun',
        state: 'lagos',
        country: 'Nigeria',
        dob: '2015-11-04',
        phone: '00110011',
        userImage: 'usersUploads/testFile.png'
      })
        .then((user) => {
          Business.create({
            businessName: 'Rocky nation',
            description: 'We produce quality products',
            street: '4 jvjvkjvj, kfkjfj',
            city: 'Sinner',
            state: 'Lagos',
            country: 'Nigeria',
            datefound: '2015-11-04',
            email: 'bigups@bfbf.b',
            phone: '111198728',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            request
              .post(`/v1/businesses/${business.dataValues.id}/reviews`)
              .send({
                response: 'very good.',
                userId: user.dataValues.id,
                businessId: business.dataValues.id
              })
              .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('id').eql(res.body.id);
                res.body.should.have.property('response').eql('very good.');
                res.body.should.have.property('userId').eql(user.dataValues.id);
                res.body.should.have.property('businessId').eql(business.dataValues.id);
                done();
              });
          });
        });
    });
  });

  describe('/PUT review', () => {
    it('it should update a review given the id', (done) => {
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
            email: 'wecon1@bfbf.b',
            phone: '134165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            Review.create({
              response: 'very good.',
              userId: user.dataValues.id,
              businessId: business.dataValues.id,
            }).then((review) => {
              request
                .put(`/v1/businesses/${business.dataValues.id}/reviews/${review.dataValues.id}`)
                .send({
                  response: 'just fair',
                  userId: user.dataValues.id,
                  businessId: business.dataValues.id
                })
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property('id').eql(review.dataValues.id);
                  res.body.should.have.property('response').eql('just fair');
                  res.body.should.have.property('userId').eql(user.dataValues.id);
                  res.body.should.have.property('businessId').eql(`${business.dataValues.id}`);
                  done();
                });
            });
          });
        });
    });

    it('it should not update a review given the wrong id', (done) => {
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
            email: 'wecon1@bfbf.b',
            phone: '134165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            Review.create({
              response: 'very good.',
              userId: user.dataValues.id,
              businessId: business.dataValues.id,
            }).then(() => {
              request
                .put(`/v1/businesses/${business.dataValues.id}/reviews/0`)
                .send({
                  response: 'just fair',
                  userId: user.dataValues.id,
                  businessId: business.dataValues.id
                })
                .end((err, res) => {
                  res.should.have.status(404);
                  res.body.should.have.property('message').eql('Review not found');
                  done();
                });
            });
          });
        });
    });

    it('it should not update a review when userId is alter', (done) => {
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
            email: 'wecon1@bfbf.b',
            phone: '134165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            Review.create({
              response: 'very good.',
              userId: user.dataValues.id,
              businessId: business.dataValues.id,
            }).then((review) => {
              request
                .put(`/v1/businesses/${business.dataValues.id}/reviews/${review.dataValues.id}`)
                .send({
                  response: 'just fair',
                  userId: 2,
                  businessId: business.dataValues.id
                })
                .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.have.property('message').eql('User can not be altered');
                  done();
                });
            });
          });
        });
    });

    it('it should not update a review when userId is alter', (done) => {
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
            email: 'wecon1@bfbf.b',
            phone: '134165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            Review.create({
              response: 'very good.',
              userId: user.dataValues.id,
              businessId: business.dataValues.id,
            }).then((review) => {
              request
                .put(`/v1/businesses/${business.dataValues.id}/reviews/${review.dataValues.id}`)
                .send({
                  response: 'just fair',
                  userId: user.dataValues.id,
                  businessId: 2
                })
                .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.have.property('message').eql('Business can not be altered');
                  done();
                });
            });
          });
        });
    });
  });

  describe('/DELETE/:id review', () => {
    it('it should not delete a review given the wrong id', (done) => {
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
            email: 'wecon1@bfbf.b',
            phone: '134165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            Review.create({
              response: 'very good.',
              userId: user.dataValues.id,
              businessId: business.dataValues.id,
            }).then(() => {
              request
                .delete(`/v1/businesses/${business.dataValues.id}/reviews/0`)
                .end((err, res) => {
                  res.should.have.status(404);
                  res.body.should.have.property('message').eql('Review not found');
                  done();
                });
            });
          });
        });
    });

    it('it should delete a review given the id', (done) => {
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
            email: 'wecon1@bfbf.b',
            phone: '134165448',
            category: 'Production',
            companyImage: '',
            userId: user.dataValues.id,
          }).then((business) => {
            Review.create({
              response: 'very good.',
              userId: user.dataValues.id,
              businessId: business.dataValues.id,
            }).then((review) => {
              request
                .delete(`/v1/businesses/${business.dataValues.id}/reviews/${review.dataValues.id}`)
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
});
