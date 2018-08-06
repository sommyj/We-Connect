// // Require the dev-dependencies
// import chai from 'chai';
// import supertest from 'supertest';
// import fs from 'file-system';
// import path from 'path';
//
// import Businesses from '../server/models/business';
// import app from '../app';
//
// chai.should();
// const request = supertest(app);
//
// /**
//  * copy file from a directory to another
//  * @param {String} src The source you are copying from.
//  * @param {String} dest The destination you are copying to.
//  * @returns {void} nothing.
//  */
// const copyFile = (src, dest) => {
//   const readStream = fs.createReadStream(src);
//
//   readStream.pipe(fs.createWriteStream(dest));
// };
//
// /**
//  * delete a file
//  * @param {String} targetPath The part to delete from
//  * @returns {void} nothing.
//  */
// const deleteFile = (targetPath) => {
//   fs.unlink(targetPath, (err) => {
//     if (err) throw err;
//   });
// };
//
// describe('Businesses', () => {
//   beforeEach((done) => { // Before each test we empty the database
//     Businesses.splice(0, Businesses.length);
//     done();
//   });
//
//   describe('/GET business', () => {
//     it('it should GET all the businesses', (done) => {
//       chai.request(app)
//         .get('/v1/businesses/')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.Businesses.should.be.a('array');
//           res.body.Businesses.length.should.be.eql(0);
//           res.body.error.should.be.eql(false);
//           done();
//         });
//     });
//   });
//
//   describe('/POST business', () => {
//     it(`it should not POST a business without description, businessName, userId,
//     description, location and category`, (done) => {
//       request
//         .post('/v1/businesses/')
//         .field('businessId', '1')
//         .field('businessName', '')
//         .field('userId', '')
//         .field('description', '')
//         .field('location', '')
//         .field('category', '')
//         .attach('companyImage', './testFile.png')
//         .end((err, res) => {
//           res.should.have.status(206);
//           res.body.should.be.a('object');
//           res.body.should.have.property('message').eql('Incomplete fields');
//           res.body.should.have.property('error').eql(true);
//
//           done();
//         });
//     });
//
//     it('it should POST a business', (done) => {
//       request
//         .post('/v1/businesses/')
//         .field('businessId', '1')
//         .field('businessName', 'Sommyj')
//         .field('userId', '22')
//         .field('description', 'We produce quality products')
//         .field('location', 'lagos')
//         .field('category', 'Production')
//         .attach('companyImage', './testFile.png')
//         .end((err, res) => {
//           res.should.have.status(201); // 'success' status
//           res.body.should.be.a('object');
//           res.body.should.have.property('Businesses');
//           res.body.Businesses.should.have.property('businessId').eql('1');
//           res.body.Businesses.should.have.property('businessName').eql('Sommyj');
//           res.body.Businesses.should.have.property('userId').eql('22');
//           res.body.Businesses.should.have.property('description').eql('We produce quality products');
//           res.body.Businesses.should.have.property('location').eql('lagos');
//           res.body.Businesses.should.have.property('category').eql('Production');
//           res.body.Businesses.should.have.property('companyImage').eql(Businesses[0].companyImage);
//           res.body.should.have.property('message').eql('Success');
//           res.body.should.have.property('error').eql(false);
//
//           // delete test image file
//           if (Businesses[0].companyImage) {
//             deleteFile(`./${Businesses[0].companyImage}`);
//           }
//           done();
//         });
//     });
//
//
//     it('it should POST a business without image', (done) => {
//       request
//         .post('/v1/businesses/')
//         .field('businessId', '1')
//         .field('businessName', 'Sommyj')
//         .field('userId', '22')
//         .field('description', 'We produce quality products')
//         .field('location', 'lagos')
//         .field('category', 'Production')
//         .attach('companyImage', '')
//         .end((err, res) => {
//           res.should.have.status(201); // 'success' status
//           res.body.should.be.a('object');
//           res.body.should.have.property('Businesses');
//           res.body.Businesses.should.have.property('businessId').eql('1');
//           res.body.Businesses.should.have.property('businessName').eql('Sommyj');
//           res.body.Businesses.should.have.property('userId').eql('22');
//           res.body.Businesses.should.have.property('description').eql('We produce quality products');
//           res.body.Businesses.should.have.property('location').eql('lagos');
//           res.body.Businesses.should.have.property('category').eql('Production');
//           res.body.Businesses.should.have.property('companyImage').eql(Businesses[0].companyImage);
//           res.body.should.have.property('message').eql('Success');
//           res.body.should.have.property('error').eql(false);
//
//           done();
//         });
//     });
//
//     it('it should not POST a business when image file type not jpg/png', (done) => {
//       request
//         .post('/v1/businesses/')
//         .field('businessId', '1')
//         .field('businessName', 'Sommyj')
//         .field('userId', '22')
//         .field('description', 'We produce quality products')
//         .field('location', 'lagos')
//         .field('category', 'Production')
//         .attach('companyImage', './testFileType.txt')
//         .end((err, res) => {
//           res.should.have.status(403);
//           res.body.should.be.a('object');
//           res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
//           res.body.should.have.property('error').eql(true);
//           done();
//         });
//     });
//
//     it(`it should not UPDATE a business
//     when image file size is larger than 2mb`, (done) => {
//       request
//         .post('/v1/businesses/')
//         .field('businessId', '1')
//         .field('businessName', 'Sommyj')
//         .field('userId', '22')
//         .field('description', 'We produce quality products')
//         .field('location', 'lagos')
//         .field('category', 'Production')
//         .attach('companyImage', './testFileSize.jpg')
//         .end((err, res) => {
//           res.should.have.status(403);
//           res.body.should.be.a('object');
//           res.body.should.have.property('message').eql('file should not be more than 2mb!');
//           res.body.should.have.property('error').eql(true);
//           done();
//         });
//     });
//   });
//
//   /*
//   * Test the /GET/ route
//   */
//   describe('/GET/ business', () => {
//     it('it should GET all businesses', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//         {
//           businessId: '12',
//           businessName: 'amsomee',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'owerri',
//           category: 'Importation',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//       request
//         .get('/v1/businesses')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           res.body.Businesses.should.have.property('0');
//           res.body.Businesses.should.have.property('1');
//           res.body.Businesses.should.have.deep.property('0', business[0]);
//           res.body.Businesses.should.have.deep.property('1', business[1]);
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('businessId').eql('11');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('businessName').eql('Sommyj');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('userId').eql('22');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('description').eql('We produce quality products');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('location').eql('lagos');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('category').eql('Production');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('companyImage').eql('');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('businessId').eql('12');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('businessName').eql('amsomee');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('userId').eql('23');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('description').eql('We produce quality service');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('location').eql('owerri');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('category').eql('Importation');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('companyImage').eql('');
//           res.body.message.should.be.eql('Success');
//           res.body.error.should.be.eql(false);
//           done();
//         });
//     });
//
//     it('it should GET a business by the given id', (done) => {
//       const business = {
//         businessId: '11',
//         businessName: 'Sommyj',
//         userId: '22',
//         description: 'We produce quality products',
//         location: 'lagos',
//         category: 'Production',
//         registered: '2015-11-04T22:09:36Z',
//         companyImage: '',
//       };
//
//       // Passing business to business model
//       Businesses.push(business);
//       request
//         .get(`/v1/businesses/${business.businessId}`)
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           res.body.message.should.be.eql('Success');
//           res.body.error.should.be.eql(false);
//           res.body.Businesses.should.have.property('businessName').eql(business.businessName);
//           res.body.Businesses.should.have.property('userId').eql(business.userId);
//           res.body.Businesses.should.have.property('description').eql(business.description);
//           res.body.Businesses.should.have.property('location').eql(business.location);
//           res.body.Businesses.should.have.property('category').eql(business.category);
//           res.body.Businesses.should.have.property('businessId').eql(business.businessId);
//           res.body.Businesses.should.have.property('companyImage').eql('');
//           done();
//         });
//     });
//
//     it('it should not GET a business by the given wrong id', (done) => {
//       const business = {
//         businessId: '11',
//         businessName: 'Sommyj',
//         userId: '22',
//         description: 'We produce quality products',
//         location: 'lagos',
//         category: 'Production',
//         registered: '2015-11-04T22:09:36Z',
//         companyImage: '',
//       };
//
//       // Passing business to business model
//       Businesses.push(business);
//       request
//         .get('/v1/businesses/13')
//         .end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.error.should.be.eql(true);
//           res.body.message.should.be.eql('Business not found');
//           done();
//         });
//     });
//
//     it('it should GET a business by the given category', (done) => {
//       const business = {
//         businessId: '11',
//         businessName: 'Sommyj',
//         userId: '22',
//         description: 'We produce quality products',
//         location: 'lagos',
//         category: 'Production',
//         registered: '2015-11-04T22:09:36Z',
//         companyImage: '',
//       };
//
//       // Passing business to business model
//       Businesses.push(business);
//       request
//         .get('/v1/businesses')
//         .query(`category=${business.category}`) // /businesses?category='Production'
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           res.body.Businesses.should.be.a('array');
//           res.body.Businesses.should.have.keys('0');
//           res.body.Businesses.should.have.property('0');
//           res.body.Businesses.should.have.deep.property('0', business).property('businessId').eql('11');
//           res.body.Businesses.should.have.deep.property('0', business).property('businessName').eql('Sommyj');
//           res.body.Businesses.should.have.deep.property('0', business).property('userId');
//           res.body.Businesses.should.have.deep.property('0', business).property('description');
//           res.body.Businesses.should.have.deep.property('0', business).property('location');
//           res.body.Businesses.should.have.deep.property('0', business).property('category').eql('Production');
//           res.body.Businesses.should.have.deep.property('0', business).property('companyImage').eql('');
//           res.body.error.should.be.eql(false);
//           res.body.message.should.be.eql('Success');
//           done();
//         });
//     });
//
//
//     it('it should not GET a business by the given wrong category', (done) => {
//       const business = {
//         businessId: '11',
//         businessName: 'Sommyj',
//         userId: '22',
//         description: 'We produce quality products',
//         location: 'lagos',
//         category: 'Production',
//         registered: '2015-11-04T22:09:36Z',
//         companyImage: '',
//       };
//
//       // Passing business to business model
//       Businesses.push(business);
//       request
//         .get('/v1/businesses')
//         .query('category=Sales') // /businesses?category='Production'
//         .end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.message.should.be.eql('Business not found');
//           res.body.error.should.be.eql(true);
//           done();
//         });
//     });
//
//
//     it('it should GET a business by the given location', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//         {
//           businessId: '12',
//           businessName: 'amsomee',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'owerri',
//           category: 'Importation',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//       request
//         .get('/v1/businesses')
//         .query(`location=${business[0].location}`) // /businesses?location='lagos'
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           res.body.Businesses.should.be.a('array');
//           res.body.Businesses.should.have.keys('0');
//           res.body.Businesses.should.have.property('0');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('businessId').eql('11');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('businessName').eql('Sommyj');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('userId');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('description');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('location');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('category').eql('Production');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('companyImage').eql('');
//           res.body.message.should.be.eql('Success');
//           res.body.error.should.be.eql(false);
//           done();
//         });
//     });
//
//
//     it('it should not GET a business by the given wrong location', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//         {
//           businessId: '12',
//           businessName: 'amsomee',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'owerri',
//           category: 'Importation',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//       request
//         .get('/v1/businesses')
//         .query('location=abuja') // /businesses?location='lagos'
//         .end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.message.should.be.eql('Business not found');
//           res.body.error.should.be.eql(true);
//           done();
//         });
//     });
//
//
//     it('it should GET a business by the given location && category', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//         {
//           businessId: '12',
//           businessName: 'Sommy',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//
//       request
//         .get('/v1/businesses')
//         .query({ location: 'lagos', category: 'Production' }) // /businesses?location='lagos'&category='Production'
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('object');
//           res.body.Businesses.should.have.property('0');
//           res.body.Businesses.should.have.property('1');
//           res.body.Businesses.should.have.deep.property('0', business[0]);
//           res.body.Businesses.should.have.deep.property('1', business[1]);
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('businessId').eql('11');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('businessName').eql('Sommyj');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('businessId').eql('12');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('businessName').eql('Sommy');
//           res.body.Businesses.should.have.deep.property('0', business[0]).property('category').eql('Production');
//           res.body.Businesses.should.have.deep.property('1', business[1]).property('category').eql('Production');
//           res.body.message.should.be.eql('Success');
//           res.body.error.should.be.eql(false);
//           done();
//         });
//     });
//
//     it('it should not GET a business by the given location && category', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//         {
//           businessId: '12',
//           businessName: 'Sommy',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'abuja',
//           category: 'Services',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//
//       request
//         .get('/v1/businesses')
//         .query({ location: 'abuja', category: 'Production' }) // /businesses?location ='lagos'&category='Production'
//         .end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.message.should.be.eql('Business not found');
//           res.body.error.should.be.eql(true);
//           done();
//         });
//     });
//   });
//
//   /*
//    * Test the /PUT/:id route
//    */
//   describe('/PUT/:id business', () => {
//     it('it should UPDATE a business given the id', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//         {
//           businessId: '13',
//           businessName: 'Sommy',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'abuja',
//           category: 'Services',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//
//       request
//         .put(`/v1/businesses/${business[0].businessId}`)
//         .field('businessId', '1')
//         .field('businessName', 'Sommyj Enterprise')
//         .field('userId', '22')
//         .field('description', 'We sale quality products')
//         .field('location', 'port-harcourt')
//         .field('category', 'Sales')
//         .attach('companyImage', './testFile.png')
//         .end((err, res) => {
//           res.should.have.status(200); // 'success' status
//           res.body.should.be.a('object');
//           res.body.should.have.property('Businesses');
//           res.body.Businesses.should.have.property('businessId').eql('11');
//           res.body.Businesses.should.have.property('businessName').eql('Sommyj Enterprise');
//           res.body.Businesses.should.have.property('userId').eql('22');
//           res.body.Businesses.should.have.property('description').eql('We sale quality products');
//           res.body.Businesses.should.have.property('location').eql('port-harcourt');
//           res.body.Businesses.should.have.property('category').eql('Sales');
//           res.body.Businesses.should.have.property('companyImage').eql(Businesses[0].companyImage);
//           res.body.should.have.property('message').eql('Bussiness updated!');
//           res.body.should.have.property('error').eql(false);
//
//           // delete test image file
//           if (Businesses[0].companyImage) {
//             deleteFile(`./${Businesses[0].companyImage}`);
//           }
//           done();
//         });
//     });
//
//
//     it('it should not UPDATE a business given the wrong id', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//         {
//           businessId: '13',
//           businessName: 'Sommy',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'abuja',
//           category: 'Services',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//
//       request
//         .put('/v1/businesses/12')
//         .field('businessId', '1')
//         .field('businessName', 'Sommyj Enterprise')
//         .field('userId', '22')
//         .field('description', 'We sale quality products')
//         .field('location', 'port-harcourt')
//         .field('category', 'Sales')
//         .attach('companyImage', './testFile.png')
//         .end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.should.have.property('error').eql(true);
//           res.body.should.have.property('message').eql('Business not found');
//
//           done();
//         });
//     });
//
//     it(`it should UPDATE a business given the id and
//     maintain already existing fields and file if none is entered`, (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: 'businessesUploads/2018-07-23T16:04:36.226ZNIIT Certificate (copy).resized.jpg',
//         },
//         {
//           businessId: '13',
//           businessName: 'Sommy',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'abuja',
//           category: 'Services',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//
//       request
//         .put(`/v1/businesses/${business[0].businessId}`)
//         .field('businessId', '1')
//         .field('businessName', '')
//         .field('userId', '')
//         .field('description', '')
//         .field('location', '')
//         .field('category', '')
//         .attach('companyImage', '')
//         .end((err, res) => {
//           res.should.have.status(200); // 'success' status
//           res.body.should.be.a('object');
//           res.body.should.have.property('Businesses');
//           res.body.Businesses.should.have.property('businessId').eql('11');
//           res.body.Businesses.should.have.property('businessName').eql('Sommyj');
//           res.body.Businesses.should.have.property('userId').eql('22');
//           res.body.Businesses.should.have.property('description').eql('We produce quality products');
//           res.body.Businesses.should.have.property('location').eql('lagos');
//           res.body.Businesses.should.have.property('category').eql('Production');
//           res.body.Businesses.should.have.property('companyImage').eql(business[0].companyImage);
//           res.body.should.have.property('message').eql('Bussiness updated!');
//           res.body.should.have.property('error').eql(false);
//
//           done();
//         });
//     });
//
//
//     it('it should UPDATE a business given the id and replace already existing file', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: 'businessesUploads/testFile.png',
//         },
//         {
//           businessId: '13',
//           businessName: 'Sommy',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'abuja',
//           category: 'Services',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//
//       const filename = 'testFile.png';
//       const src = path.join('./', filename);
//       const destDir = path.join('./', 'businessesUploads');
//
//       fs.access(destDir, (err) => {
//         if (err) { fs.mkdirSync(destDir); }
//
//         copyFile(src, path.join(destDir, filename));
//       });
//
//
//       request
//         .put('/v1/businesses/11')
//         .field('businessId', '13')
//         .field('businessName', 'Sommyj Enterprise')
//         .field('userId', '22')
//         .field('description', 'We sale quality products')
//         .field('location', 'port-harcourt')
//         .field('category', 'Sales')
//         .attach('companyImage', './testFile.png')
//         .end((err, res) => {
//           res.should.have.status(200); // 'success' status
//           res.body.should.be.a('object');
//           res.body.should.have.property('Businesses');
//           res.body.Businesses.should.have.property('businessId').eql('11');
//           res.body.Businesses.should.have.property('businessName').eql('Sommyj Enterprise');
//           res.body.Businesses.should.have.property('userId').eql('22');
//           res.body.Businesses.should.have.property('description').eql('We sale quality products');
//           res.body.Businesses.should.have.property('location').eql('port-harcourt');
//           res.body.Businesses.should.have.property('category').eql('Sales');
//           res.body.Businesses.should.have.property('companyImage').eql(Businesses[0].companyImage);
//           res.body.should.have.property('message').eql('Bussiness updated!');
//           res.body.should.have.property('error').eql(false);
//
//           // delete test image file
//           if (Businesses[0].companyImage) {
//             deleteFile(`./${Businesses[0].companyImage}`);
//           }
//           done();
//         });
//     });
//
//     it('it should not UPDATE a business when image file type not jpg/png', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: 'businessesUploads/testFile.png',
//         },
//         {
//           businessId: '13',
//           businessName: 'Sommy',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'abuja',
//           category: 'Services',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//
//       request
//         .put('/v1/businesses/11')
//         .field('businessId', '1')
//         .field('businessName', 'Sommyj')
//         .field('userId', '22')
//         .field('description', 'We produce quality products')
//         .field('location', 'lagos')
//         .field('category', 'Production')
//         .attach('companyImage', './testFileType.txt')
//         .end((err, res) => {
//           res.should.have.status(403);
//           res.body.should.be.a('object');
//           res.body.should.have.property('message').eql('Only .png and .jpg files are allowed!');
//           res.body.should.have.property('error').eql(true);
//           done();
//         });
//     });
//
//
//     it(`it should not UPDATE a business
//     when image file size is larger than 2mb`, (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: 'businessesUploads/testFile.png',
//         },
//         {
//           businessId: '13',
//           businessName: 'Sommy',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'abuja',
//           category: 'Services',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//
//       request
//         .put('/v1/businesses/11')
//         .field('businessId', '1')
//         .field('businessName', 'Sommyj')
//         .field('userId', '22')
//         .field('description', 'We produce quality products')
//         .field('location', 'lagos')
//         .field('category', 'Production')
//         .attach('companyImage', './testFileSize.jpg')
//         .end((err, res) => {
//           res.should.have.status(403);
//           res.body.should.be.a('object');
//           res.body.should.have.property('message').eql('file should not be more than 2mb!');
//           res.body.should.have.property('error').eql(true);
//           done();
//         });
//     });
//   });
//
//   /*
//   * Test the /DELETE/:id route
//   */
//   describe('/DELETE/:id business', () => {
//     it('it should DELETE a business given the id', (done) => {
//       const business = [
//         {
//           businessId: '11',
//           businessName: 'Sommyj',
//           userId: '22',
//           description: 'We produce quality products',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: 'businessesUploads/testFile.png',
//         },
//         {
//           businessId: '12',
//           businessName: 'Sommy',
//           userId: '23',
//           description: 'We produce quality service',
//           location: 'lagos',
//           category: 'Production',
//           registered: '2015-11-04T22:09:36Z',
//           companyImage: '',
//         },
//       ];
//
//       // Passing business to business model
//       Businesses.push(business[0]);
//       Businesses.push(business[1]);
//
//       const filename = 'testFile.png';
//       const src = path.join('./', filename);
//       const destDir = path.join('./', 'businessesUploads');
//
//       // copy image file to businessesUploads
//       fs.access(destDir, (err) => {
//         if (err) { fs.mkdirSync(destDir); }
//
//         copyFile(src, path.join(destDir, filename));
//       });
//
//
//       request
//         .delete('/v1/businesses/11')
//         .end((err, res) => {
//           res.should.have.status(204);
//           res.body.should.be.a('object');
//           done();
//         });
//     });
//
//     it('it should not DELETE a business given the wrong id', (done) => {
//       const business = {
//         businessId: '11',
//         businessName: 'Sommyj',
//         userId: '22',
//         description: 'We produce quality products',
//         location: 'lagos',
//         category: 'Production',
//         registered: '2015-11-04T22:09:36Z',
//         companyImage: '',
//       };
//
//       // Passing business to business model
//       Businesses.push(business);
//       request
//         .delete('/v1/businesses/13')
//         .end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.error.should.be.eql(true);
//           res.body.should.have.property('message').eql('Business not found');
//           done();
//         });
//     });
//   });
//
// });
