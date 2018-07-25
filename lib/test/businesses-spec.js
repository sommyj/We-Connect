'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _fileSystem = require('file-system');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _business = require('../server/models/business');

var _business2 = _interopRequireDefault(_business);

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

describe('Businesses', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    _business2.default.splice(0, _business2.default.length);
    done();
  });

  describe('/GET business', function () {
    it('it should GET all the businesses', function (done) {
      _chai2.default.request(_app2.default).get('/v1/businesses/').end(function (err, res) {
        res.should.have.status(200);
        res.body.Businesses.should.be.a('array');
        res.body.Businesses.length.should.be.eql(0);
        res.body.error.should.be.eql(false);
        done();
      });
    });
  });

  describe('/POST business', function () {
    it('it should not CREATE a business without description, businessName, userId,\n    description, location and category', function (done) {
      request.post('/v1/businesses/').field('businessId', '1').field('businessName', '').field('userId', '').field('description', '').field('location', '').field('category', '').attach('companyImage', './testFile.png').end(function (err, res) {
        res.should.have.status(206);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Incomplete fields');
        res.body.should.have.property('error').eql(true);

        done();
      });
    });

    it('it should CREATE a business', function (done) {
      request.post('/v1/businesses/').field('businessId', '1').field('businessName', 'Sommyj').field('userId', '22').field('description', 'We produce quality products').field('location', 'lagos').field('category', 'Production').attach('companyImage', './testFile.png').end(function (err, res) {
        res.should.have.status(201); // 'success' status
        res.body.should.be.a('object');
        res.body.should.have.property('Businesses');
        res.body.Businesses.should.have.property('businessId').eql('1');
        res.body.Businesses.should.have.property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.property('userId').eql('22');
        res.body.Businesses.should.have.property('description').eql('We produce quality products');
        res.body.Businesses.should.have.property('location').eql('lagos');
        res.body.Businesses.should.have.property('category').eql('Production');
        res.body.Businesses.should.have.property('companyImage').eql(_business2.default[0].companyImage);
        res.body.should.have.property('message').eql('Success');
        res.body.should.have.property('error').eql(false);

        // delete test image file
        if (_business2.default[0].companyImage) {
          _fileSystem2.default.unlink('./' + _business2.default[0].companyImage, function (err) {
            if (err) throw err;
          });
        }
        done();
      });
    });

    it('it should CREATE a business without image', function (done) {
      request.post('/v1/businesses/').field('businessId', '1').field('businessName', 'Sommyj').field('userId', '22').field('description', 'We produce quality products').field('location', 'lagos').field('category', 'Production').attach('companyImage', '').end(function (err, res) {
        res.should.have.status(201); // 'success' status
        res.body.should.be.a('object');
        res.body.should.have.property('Businesses');
        res.body.Businesses.should.have.property('businessId').eql('1');
        res.body.Businesses.should.have.property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.property('userId').eql('22');
        res.body.Businesses.should.have.property('description').eql('We produce quality products');
        res.body.Businesses.should.have.property('location').eql('lagos');
        res.body.Businesses.should.have.property('category').eql('Production');
        res.body.Businesses.should.have.property('companyImage').eql(_business2.default[0].companyImage);
        res.body.should.have.property('message').eql('Success');
        res.body.should.have.property('error').eql(false);

        done();
      });
    });

    it('it should not CREATE a business when image file type not jpg/png', function (done) {
      request.post('/v1/businesses/').field('businessId', '1').field('businessName', 'Sommyj').field('userId', '22').field('description', 'We produce quality products').field('location', 'lagos').field('category', 'Production').attach('companyImage', './testFileType.txt').end(function (err, res) {
        res.should.have.status(500);
        res.body.should.be.a('object');
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
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }, {
        businessId: '12',
        businessName: 'amsomee',
        userId: '23',
        description: 'We produce quality service',
        location: 'owerri',
        category: 'Importation',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);
      request.get('/v1/businesses').end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Businesses.should.have.property('0');
        res.body.Businesses.should.have.property('1');
        res.body.Businesses.should.have.deep.property('0', business[0]);
        res.body.Businesses.should.have.deep.property('1', business[1]);
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessId').eql('11');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('userId').eql('22');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('description').eql('We produce quality products');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('location').eql('lagos');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('category').eql('Production');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('companyImage').eql('');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('businessId').eql('12');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('businessName').eql('amsomee');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('userId').eql('23');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('description').eql('We produce quality service');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('location').eql('owerri');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('category').eql('Importation');
        res.body.Businesses.should.have.deep.property('1', business[1]).property('companyImage').eql('');
        res.body.message.should.be.eql('Success');
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should GET a business by the given id', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      };

      // Passing business to business model
      _business2.default.push(business);
      request.get('/v1/businesses/' + business.businessId).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.message.should.be.eql('Success');
        res.body.error.should.be.eql(false);
        res.body.Businesses.should.have.property('businessName').eql(business.businessName);
        res.body.Businesses.should.have.property('userId').eql(business.userId);
        res.body.Businesses.should.have.property('description').eql(business.description);
        res.body.Businesses.should.have.property('location').eql(business.location);
        res.body.Businesses.should.have.property('category').eql(business.category);
        res.body.Businesses.should.have.property('businessId').eql(business.businessId);
        res.body.Businesses.should.have.property('companyImage').eql('');
        done();
      });
    });

    it('it should not GET a business by the given wrong id', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      };

      // Passing business to business model
      _business2.default.push(business);
      request.get('/v1/businesses/13').end(function (err, res) {
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
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      };

      // Passing business to business model
      _business2.default.push(business);
      request.get('/v1/businesses').query('category=' + business.category) // /businesses?category='Production'
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Businesses.should.be.a('array');
        res.body.Businesses.should.have.keys('0');
        res.body.Businesses.should.have.property('0');
        res.body.Businesses.should.have.deep.property('0', business).property('businessId').eql('11');
        res.body.Businesses.should.have.deep.property('0', business).property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.deep.property('0', business).property('userId');
        res.body.Businesses.should.have.deep.property('0', business).property('description');
        res.body.Businesses.should.have.deep.property('0', business).property('location');
        res.body.Businesses.should.have.deep.property('0', business).property('category').eql('Production');
        res.body.Businesses.should.have.deep.property('0', business).property('companyImage').eql('');
        res.body.error.should.be.eql(false);
        res.body.message.should.be.eql('Success');
        done();
      });
    });

    it('it should not GET a business by the given wrong category', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      };

      // Passing business to business model
      _business2.default.push(business);
      request.get('/v1/businesses').query('category=Sales') // /businesses?category='Production'
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
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }, {
        businessId: '12',
        businessName: 'amsomee',
        userId: '23',
        description: 'We produce quality service',
        location: 'owerri',
        category: 'Importation',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);
      request.get('/v1/businesses').query('location=' + business[0].location) // /businesses?location='lagos'
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Businesses.should.be.a('array');
        res.body.Businesses.should.have.keys('0');
        res.body.Businesses.should.have.property('0');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessId').eql('11');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('userId');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('description');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('location');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('category').eql('Production');
        res.body.Businesses.should.have.deep.property('0', business[0]).property('companyImage').eql('');
        res.body.message.should.be.eql('Success');
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should not GET a business by the given wrong location', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }, {
        businessId: '12',
        businessName: 'amsomee',
        userId: '23',
        description: 'We produce quality service',
        location: 'owerri',
        category: 'Importation',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);
      request.get('/v1/businesses').query('location=abuja') // /businesses?location='lagos'
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
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }, {
        businessId: '12',
        businessName: 'Sommy',
        userId: '23',
        description: 'We produce quality service',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      request.get('/v1/businesses').query({ location: 'lagos', category: 'Production' }) // /businesses?location='lagos'&category='Production'
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
        res.body.message.should.be.eql('Success');
        res.body.error.should.be.eql(false);
        done();
      });
    });

    it('it should not GET a business by the given location && category', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }, {
        businessId: '12',
        businessName: 'Sommy',
        userId: '23',
        description: 'We produce quality service',
        location: 'abuja',
        category: 'Services',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      request.get('/v1/businesses').query({ location: 'abuja', category: 'Production' }) // /businesses?location ='lagos'&category='Production'
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
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }, {
        businessId: '13',
        businessName: 'Sommy',
        userId: '23',
        description: 'We produce quality service',
        location: 'abuja',
        category: 'Services',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      request.put('/v1/businesses/' + business[0].businessId).field('businessId', '1').field('businessName', 'Sommyj Enterprise').field('userId', '22').field('description', 'We sale quality products').field('location', 'port-harcourt').field('category', 'Sales').attach('companyImage', './testFile.png').end(function (err, res) {
        res.should.have.status(200); // 'success' status
        res.body.should.be.a('object');
        res.body.should.have.property('Businesses');
        res.body.Businesses.should.have.property('businessId').eql('11');
        res.body.Businesses.should.have.property('businessName').eql('Sommyj Enterprise');
        res.body.Businesses.should.have.property('userId').eql('22');
        res.body.Businesses.should.have.property('description').eql('We sale quality products');
        res.body.Businesses.should.have.property('location').eql('port-harcourt');
        res.body.Businesses.should.have.property('category').eql('Sales');
        res.body.Businesses.should.have.property('companyImage').eql(_business2.default[0].companyImage);
        res.body.should.have.property('message').eql('Bussiness updated!');
        res.body.should.have.property('error').eql(false);

        // delete test image file
        if (_business2.default[0].companyImage) {
          _fileSystem2.default.unlink('./' + _business2.default[0].companyImage, function (err) {
            if (err) throw err;
          });
        }
        done();
      });
    });

    it('it should not UPDATE a business given the wrong id', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }, {
        businessId: '13',
        businessName: 'Sommy',
        userId: '23',
        description: 'We produce quality service',
        location: 'abuja',
        category: 'Services',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      request.put('/v1/businesses/12').field('businessId', '1').field('businessName', 'Sommyj Enterprise').field('userId', '22').field('description', 'We sale quality products').field('location', 'port-harcourt').field('category', 'Sales').attach('companyImage', './testFile.png').end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql(true);
        res.body.should.have.property('message').eql('Business not found');

        done();
      });
    });

    it('it should UPDATE a business given the id and\n    maintain already existing fields and file if none is entered', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: 'businessesUploads/2018-07-23T16:04:36.226ZNIIT Certificate (copy).resized.jpg'
      }, {
        businessId: '13',
        businessName: 'Sommy',
        userId: '23',
        description: 'We produce quality service',
        location: 'abuja',
        category: 'Services',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      request.put('/v1/businesses/' + business[0].businessId).field('businessId', '1').field('businessName', '').field('userId', '').field('description', '').field('location', '').field('category', '').attach('companyImage', '').end(function (err, res) {
        res.should.have.status(200); // 'success' status
        res.body.should.be.a('object');
        res.body.should.have.property('Businesses');
        res.body.Businesses.should.have.property('businessId').eql('11');
        res.body.Businesses.should.have.property('businessName').eql('Sommyj');
        res.body.Businesses.should.have.property('userId').eql('22');
        res.body.Businesses.should.have.property('description').eql('We produce quality products');
        res.body.Businesses.should.have.property('location').eql('lagos');
        res.body.Businesses.should.have.property('category').eql('Production');
        res.body.Businesses.should.have.property('companyImage').eql(business[0].companyImage);
        res.body.should.have.property('message').eql('Bussiness updated!');
        res.body.should.have.property('error').eql(false);

        done();
      });
    });

    it('it should UPDATE a business given the id and replace already existing file', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: 'businessesUploads/testFile.png'
      }, {
        businessId: '13',
        businessName: 'Sommy',
        userId: '23',
        description: 'We produce quality service',
        location: 'abuja',
        category: 'Services',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      var filename = 'testFile.png';
      var src = _path2.default.join('./', filename);
      var destDir = _path2.default.join('./', 'businessesUploads');

      _fileSystem2.default.access(destDir, function (err) {
        if (err) {
          _fileSystem2.default.mkdirSync(destDir);
        }

        copyFile(src, _path2.default.join(destDir, filename));
      });

      request.put('/v1/businesses/11').field('businessId', '13').field('businessName', 'Sommyj Enterprise').field('userId', '22').field('description', 'We sale quality products').field('location', 'port-harcourt').field('category', 'Sales').attach('companyImage', './testFile.png').end(function (err, res) {
        res.should.have.status(200); // 'success' status
        res.body.should.be.a('object');
        res.body.should.have.property('Businesses');
        res.body.Businesses.should.have.property('businessId').eql('11');
        res.body.Businesses.should.have.property('businessName').eql('Sommyj Enterprise');
        res.body.Businesses.should.have.property('userId').eql('22');
        res.body.Businesses.should.have.property('description').eql('We sale quality products');
        res.body.Businesses.should.have.property('location').eql('port-harcourt');
        res.body.Businesses.should.have.property('category').eql('Sales');
        res.body.Businesses.should.have.property('companyImage').eql(_business2.default[0].companyImage);
        res.body.should.have.property('message').eql('Bussiness updated!');
        res.body.should.have.property('error').eql(false);

        // delete test image file
        if (_business2.default[0].companyImage) {
          _fileSystem2.default.unlink('./' + _business2.default[0].companyImage, function (err) {
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
  describe('/DELETE/:id business', function () {
    it('it should DELETE a business given the id', function (done) {
      var business = [{
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: 'businessesUploads/testFile.png'
      }, {
        businessId: '12',
        businessName: 'Sommy',
        userId: '23',
        description: 'We produce quality service',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      }];

      // Passing business to business model
      _business2.default.push(business[0]);
      _business2.default.push(business[1]);

      var filename = 'testFile.png';
      var src = _path2.default.join('./', filename);
      var destDir = _path2.default.join('./', 'businessesUploads');

      // copy image file to businessesUploads
      _fileSystem2.default.access(destDir, function (err) {
        if (err) {
          _fileSystem2.default.mkdirSync(destDir);
        }

        copyFile(src, _path2.default.join(destDir, filename));
      });

      request.delete('/v1/businesses/11').end(function (err, res) {
        res.should.have.status(204);
        res.body.should.be.a('object');
        done();
      });
    });

    it('it should not DELETE a business given the wrong id', function (done) {
      var business = {
        businessId: '11',
        businessName: 'Sommyj',
        userId: '22',
        description: 'We produce quality products',
        location: 'lagos',
        category: 'Production',
        registered: '2015-11-04T22:09:36Z',
        companyImage: ''
      };

      // Passing business to business model
      _business2.default.push(business);
      request.delete('/v1/businesses/13').end(function (err, res) {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.error.should.be.eql(true);
        res.body.should.have.property('message').eql('Business not found');
        done();
      });
    });
  });

  describe('connect.static()', function () {
    it('should serve static files', function (done) {
      var filename = 'testFile.png';
      var src = _path2.default.join('./', filename);
      var destDir = _path2.default.join('./', 'businessesUploads');

      // copy image file to businessesUploads
      _fileSystem2.default.access(destDir, function (err) {
        if (err) {
          _fileSystem2.default.mkdirSync(destDir);
        }

        copyFile(src, _path2.default.join(destDir, filename));
      });

      request.get('/businessesUploads/testFile.png').end(function () {
        // delete test image file
        if (_path2.default.resolve('./businessesUploads/testFile.png')) {
          _fileSystem2.default.unlink('./businessesUploads/testFile.png', function (err) {
            if (err) throw err;
          });
        }
        done();
      });
    });
  });
});