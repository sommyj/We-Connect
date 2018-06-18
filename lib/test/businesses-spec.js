'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _business = require('../server/models/business');

var _business2 = _interopRequireDefault(_business);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Require the dev-dependencies
_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

describe('Businesses', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    _business2.default.splice(0, _business2.default.length);
    done();
  });

  describe('/GET business', function () {
    it('it should GET all the businesses', function (done) {
      _chai2.default.request(_app2.default).get('/businesses/').end(function (err, res) {
        res.should.have.status(200);
        res.body.Businesses.should.be.a('array');
        res.body.Businesses.length.should.be.eql(0);
        res.body.error.should.be.eql(false);
        done();
      });
    });
  });

  describe('/POST business', function () {
    it('it should not POST a business without reviews', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        location: 'lagos',
        category: 'Production'
      };

      _chai2.default.request(_app2.default).post('/businesses/').send(business).end(function (err, res) {
        res.should.have.status(206);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Incomplete fields');
        res.body.should.have.property('error').eql(true);
        done();
      });
    });

    it('it should post a business', function (done) {
      var business = {
        businessId: '1',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      };

      _chai2.default.request(_app2.default).post('/businesses/').send(business).end(function (err, res) {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('Businesses');
        res.body.Businesses.should.be.a('array');
        res.body.Businesses.should.have.keys('0');
        res.body.Businesses.should.have.property('0');
        res.body.Businesses.should.have.deep.property('0', business).property('businessId').eql('1');
        res.body.Businesses.should.have.deep.property('0', business).property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.deep.property('0', business).property('userId').eql('22');
        res.body.Businesses.should.have.deep.property('0', business).property('reviews').eql('We produce quality products');
        res.body.Businesses.should.have.deep.property('0', business).property('location').eql('lagos');
        res.body.Businesses.should.have.deep.property('0', business).property('category').eql('Production');
        res.body.should.have.property('message').eql('Success');
        res.body.should.have.property('error').eql(false);
        done();
      });
    });
  });

  /*
  * Test the /GET/ route
  */
  describe('/GET/ business', function () {
    it('it should GET all businesses', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      }, {
        businessId: '12',
        businessName: 'amsomee',
        userId: '23',
        reviews: 'We produce quality service',
        location: 'owerri',
        category: 'Importation'
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);
      _chai2.default.request(_app2.default).get('/businesses').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Businesses.should.have.property('0');
        res.body.Businesses.should.have.property('1');
        res.body.Businesses.should.have.deep.property('0', business[0]);
        res.body.Businesses.should.have.deep.property('1', business[1]);
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessId').eql('11');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('userId').eql('22');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('reviews').eql('We produce quality products');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('location').eql('lagos');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('category').eql('Production');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('businessId').eql('12');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('businessName').eql('amsomee');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('userId').eql('23');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('reviews').eql('We produce quality service');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('location').eql('owerri');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('category').eql('Importation');
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should GET a business by the given id', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      };

      // Passing business to business model
      _business2.default.push(business);
      _chai2.default.request(_app2.default).get('/businesses/' + business.businessId).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.error.should.be.eql(false);
        res.body.Businesses.should.have.property('businessName').eql(business.businessName);
        res.body.Businesses.should.have.property('userId').eql(business.userId);
        res.body.Businesses.should.have.property('reviews').eql(business.reviews);
        res.body.Businesses.should.have.property('location').eql(business.location);
        res.body.Businesses.should.have.property('category').eql(business.category);
        res.body.Businesses.should.have.property('businessId').eql(business.businessId);
        done();
      });
    });

    it('it should not GET a business by the given wrong id', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      };

      // Passing business to business model
      _business2.default.push(business);
      _chai2.default.request(_app2.default).get('/businesses/13').end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.error.should.be.eql(true);
        res.body.message.should.be.eql('Business not found');
        done();
      });
    });

    it('it should GET a business by the given category', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      };

      // Passing business to business model
      _business2.default.push(business);
      _chai2.default.request(_app2.default).get('/businesses').query('category=' + business.category) // /businesses?category='Production'
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Businesses.should.be.a('array');
        res.body.Businesses.should.have.keys('0');
        res.body.Businesses.should.have.property('0');
        res.body.Businesses.should.have.deep.property('0', business).property('businessId').eql('11');
        res.body.Businesses.should.have.deep.property('0', business).property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.deep.property('0', business).property('userId');
        res.body.Businesses.should.have.deep.property('0', business).property('reviews');
        res.body.Businesses.should.have.deep.property('0', business).property('location');
        res.body.Businesses.should.have.deep.property('0', business).property('category').eql('Production');
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should not GET a business by the given wrong category', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      };

      // Passing business to business model
      _business2.default.push(business);
      _chai2.default.request(_app2.default).get('/businesses').query('category=Sales') // /businesses?category='Production'
      .end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.message.should.be.eql('Business not found');
        res.body.error.should.be.eql(true);
        done();
      });
    });

    it('it should GET a business by the given location', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      }, {
        businessId: '12',
        businessName: 'amsomee',
        userId: '23',
        reviews: 'We produce quality service',
        location: 'owerri',
        category: 'Importation'
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);
      _chai2.default.request(_app2.default).get('/businesses').query('location=' + business[0].location) // /businesses?location='lagos'
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Businesses.should.be.a('array');
        res.body.Businesses.should.have.keys('0');
        res.body.Businesses.should.have.property('0');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessId').eql('11');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('userId');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('reviews');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('location');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('category').eql('Production');
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should not GET a business by the given wrong location', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      }, {
        businessId: '12',
        businessName: 'amsomee',
        userId: '23',
        reviews: 'We produce quality service',
        location: 'owerri',
        category: 'Importation'
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);
      _chai2.default.request(_app2.default).get('/businesses').query('location=abuja') // /businesses?location='lagos'
      .end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.message.should.be.eql('Business not found');
        res.body.error.should.be.eql(true);
        done();
      });
    });

    it('it should GET a business by the given location && category', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      }, {
        businessId: '12',
        businessName: 'Sommy',
        userId: '23',
        reviews: 'We produce quality service',
        location: 'lagos',
        category: 'Production'
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      _chai2.default.request(_app2.default).get('/businesses').query({ location: 'lagos', category: 'Production' }) // /businesses?location='lagos'&category='Production'
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Businesses.should.have.property('0');
        res.body.Businesses.should.have.property('1');
        res.body.Businesses.should.have.deep.property('0', business[0]);
        res.body.Businesses.should.have.deep.property('1', business[1]);
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessId').eql('11');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('businessId').eql('12');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('businessName').eql('Sommy');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('category').eql('Production');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('category').eql('Production');
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should not GET a business by the given location && category', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      }, {
        businessId: '12',
        businessName: 'Sommy',
        userId: '23',
        reviews: 'We produce quality service',
        location: 'abuja',
        category: 'Services'
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      _chai2.default.request(_app2.default).get('/businesses').query({ location: 'abuja', category: 'Production' }) // /businesses?location ='lagos'&category='Production'
      .end(function (err, res) {
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
  describe('/PUT/:id business', function () {
    it('it should UPDATE a business given the id', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      }, {
        businessId: '13',
        businessName: 'Sommy',
        userId: '23',
        reviews: 'We produce quality service',
        location: 'abuja',
        category: 'Services'
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      _chai2.default.request(_app2.default).put('/businesses/' + business[0].businessId).send({
        businessId: '12',
        businessName: 'Sommyj Enterprise',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'port-harcourt',
        category: 'Sales'
      }).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql(false);
        res.body.should.have.property('message').eql('Bussiness updated!');
        res.body.Businesses.should.have.property('businessId').eql('11');
        res.body.Businesses.should.have.property('location').eql('port-harcourt');
        res.body.Businesses.should.have.property('category').eql('Sales');
        res.body.Businesses.should.have.property('businessName').eql('Sommyj Enterprise');
        done();
      });
    });

    it('it should not UPDATE a business given the wrong id', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      }, {
        businessId: '12',
        businessName: 'Sommy',
        userId: '23',
        reviews: 'We produce quality service',
        location: 'lagos',
        category: 'Production'
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      _chai2.default.request(_app2.default).put('/businesses/13').send({
        businessId: '19',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'port-harcourt',
        category: 'Production'
      }).end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql(true);
        res.body.should.have.property('message').eql('Business not found');
        done();
      });
    });
  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id business', function () {
    it('it should DELETE a business given the id', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      }, {
        businessId: '12',
        businessName: 'Sommy',
        userId: '23',
        reviews: 'We produce quality service',
        location: 'lagos',
        category: 'Production'
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      _chai2.default.request(_app2.default).delete('/businesses/' + business[0].businessId).end(function (err, res) {
        res.should.have.status(204);
        res.body.should.be.a('object');
        res.body.should.be.empty;
        // res.body.error.should.be.eql(false);
        // res.body.Businesses.length.should.be.eql(0);
        // res.body.should.have.property('message').eql('Business successfully deleted!');
        done();
      });
    });

    it('it should not DELETE a business given the wrong id', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        reviews: 'We produce quality products',
        location: 'lagos',
        category: 'Production'
      };

      // Passing business to business model
      _business2.default.push(business);
      _chai2.default.request(_app2.default).delete('/businesses/13').end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.error.should.be.eql(true);
        res.body.should.have.property('message').eql('Business not found');
        done();
      });
    });
  });
});