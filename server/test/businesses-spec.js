const Business = require('../server/models/business');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.should();
chai.use(chaiHttp);


describe('Businesses', () => {
  beforeEach((done) => { // Before each test we empty the database
    Business.splice(0, Business.length);
    done();
  });

  describe('/GET business', () => {
    it('it should GET all the businesses', (done) => {
      chai.request(app)
        .get('/businesses/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.business.should.be.a('array');
          res.body.business.length.should.be.eql(0);
          res.body.error.should.be.eql(false);
          done();
        });
    });
  });

  describe('/POST business', () => {
    it('it should not POST a business without reviews', (done) => {
      const business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        location: 'lagos',
        category: 'Production',
      };

      chai.request(app)
        .post('/businesses/')
        .send(business)
        .end((err, res) => {
          res.should.have.status(206);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Incomplete fields');
          res.body.should.have.property('error').eql(true);
          done();
        });
    });

    it('it should post a business', (done) => {
      const business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
      };

      chai.request(app)
        .post('/businesses/')
        .send(business)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('business');
          res.body.business.should.be.a('array');
          res.body.business.should.have.keys('0');
          res.body.business.should.have.property('0');
          res.body.business.should.have.deep.property('0', business).property('businessId').eql('11');
          res.body.business.should.have.deep.property('0', business).property('businessName').eql('Sommyj');
          res.body.business.should.have.deep.property('0', business).property('userId');
          res.body.business.should.have.deep.property('0', business).property('reviews');
          res.body.business.should.have.deep.property('0', business).property('location');
          res.body.business.should.have.deep.property('0', business).property('category');
          res.body.should.have.property('message').eql('Success');
          res.body.should.have.property('error').eql(false);
          done();
        });
    });
  });

  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id business', () => {
    it('it should GET a business by the given id', (done) => {
      const business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
      };

      // Passing business to business model
      Business.push(business);
      chai.request(app)
        .get(`/businesses/${business.businessId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.business.should.have.property('businessName');
          res.body.business.should.have.property('userId');
          res.body.business.should.have.property('reviews');
          res.body.business.should.have.property('location');
          res.body.business.should.have.property('category');
          res.body.business.should.have.property('businessId').eql(business.businessId);
          done();
        });
    });

    it('it should GET a business by the given category', (done) => {
      const business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
      };

      // Passing business to business model
      Business.push(business);
      chai.request(app)
        .get('/businesses')
        .query(`category=${business.category}`) // /businesses?category='Production'
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.business.should.be.a('array');
          res.body.business.should.have.keys('0');
          res.body.business.should.have.property('0');
          res.body.business.should.have.deep.property('0', business).property('businessId').eql('11');
          res.body.business.should.have.deep.property('0', business).property('businessName').eql('Sommyj');
          res.body.business.should.have.deep.property('0', business).property('userId');
          res.body.business.should.have.deep.property('0', business).property('reviews');
          res.body.business.should.have.deep.property('0', business).property('location');
          res.body.business.should.have.deep.property('0', business).property('category').eql('Production');
          res.body.error.should.be.eql(false);
          done();
        });
    });

    it('it should GET a business by the given location && category', (done) => {
      const business = [
        {
          businessId: '11',
          businessName: 'Sommyj',
          userId: '22',
          reviews: 'We produce quality products',
          location: 'lagos',
          category: 'Production',
        },
        {
          businessId: '12',
          businessName: 'Sommy',
          userId: '23',
          reviews: 'We produce quality service',
          location: 'lagos',
          category: 'Production',
        },
      ];

      // Passing business to business model
      Business.push(business[0]);
      Business.push(business[1]);

      chai.request(app)
        .get('/businesses')
        .query({ location: 'lagos', category: 'Production' }) // /businesses?location='lagos'&category='Production'
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.business.should.have.property('0');
          res.body.business.should.have.property('1');
          res.body.business.should.have.deep.property('0', business[0]);
          res.body.business.should.have.deep.property('1', business[1]);
          res.body.business.should.have.deep.property('0', business[0]).property('businessId').eql('11');
          res.body.business.should.have.deep.property('0', business[0]).property('businessName').eql('Sommyj');
          res.body.business.should.have.deep.property('1', business[1]).property('businessId').eql('12');
          res.body.business.should.have.deep.property('1', business[1]).property('businessName').eql('Sommy');
          res.body.business.should.have.deep.property('0', business[0]).property('category').eql('Production');
          res.body.business.should.have.deep.property('1', business[1]).property('category').eql('Production');
          res.body.error.should.be.eql(false);
          done();
        });
    });

    it('it should not GET a business by the given location && category', (done) => {
      const business = [
        {
          businessId: '11',
          businessName: 'Sommyj',
          userId: '22',
          reviews: 'We produce quality products',
          location: 'lagos',
          category: 'Production',
        },
        {
          businessId: '12',
          businessName: 'Sommy',
          userId: '23',
          reviews: 'We produce quality service',
          location: 'abuja',
          category: 'Services',
        },
      ];

      // Passing business to business model
      Business.push(business[0]);
      Business.push(business[1]);
      chai.request(app)
        .get('/businesses')
        .query({ location: 'abuja', category: 'Production' }) // /businesses?location ='lagos'&category='Production'
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.message.should.be.eql('Business not found');
          res.body.error.should.be.eql(true);
          done();
        });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id business', () => {
    it('it should UPDATE a business given the id', (done) => {
      const business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
      };

      // Passing business to business model
      Business.push(business);

      chai.request(app)
        .put(`/businesses/${business.businessId}`)
        .send({
          businessId: '11',
          businessName: 'Sommyj',
          userId: '22',
          reviews: 'We produce quality products',
          location: 'port-harcourt',
          category: 'Production',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Bussiness updated!');
          res.body.business.should.have.property('location').eql('port-harcourt');
          done();
        });
    });
  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id business', () => {
    it('it should DELETE a business given the id', (done) => {
      const business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
      };

      // Passing business to business model
      Business.push(business);
      chai.request(app)
        .delete(`/businesses/${business.businessId}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Business successfully deleted!');
          done();
        });
    });
  });
});
