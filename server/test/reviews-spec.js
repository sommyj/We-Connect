// // Require the dev-dependencies
// import chai from 'chai';
// import chaiHttp from 'chai-http';
//
// import Reviews from '../server/models/review';
// import app from '../app';
//
// chai.should();
// chai.use(chaiHttp);
//
//
// describe('Reviews', () => {
//   beforeEach((done) => { // Before each test we empty the database
//     Reviews.splice(0, Reviews.length);
//     done();
//   });
//
//   describe('/GET review', () => {
//     it('it should GET empty reviews', (done) => {
//       chai.request(app)
//         .get('/v1/businesses/1/reviews')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.Reviews.should.be.a('array');
//           res.body.should.have.property('Reviews');
//           res.body.Reviews.length.should.be.eql(0);
//           res.body.error.should.be.eql(false);
//           done();
//         });
//     });
//     it('it should GET all the reviews', (done) => {
//       const review = [
//         {
//           id: 1,
//           userId: '3',
//           businessId: '2',
//         },
//         {
//           id: 7,
//           userId: '8',
//           businessId: '2',
//         },
//       ];
//
//       // Passing review to review model
//       Reviews.push(review[0]);
//       Reviews.push(review[1]);
//       chai.request(app)
//         .get('/v1/businesses/2/reviews')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.Reviews.should.be.a('array');
//           res.body.should.have.property('Reviews');
//           res.body.Reviews.should.have.deep.property(0, review[0]).property('id').eql(1);
//           res.body.Reviews.should.have.deep.property(0, review[0]).property('userId').eql('3');
//           res.body.Reviews.should.have.deep.property(0, review[0]).property('businessId').eql('2');
//           res.body.Reviews.should.have.deep.property(1, review[1]).property('id').eql(7);
//           res.body.Reviews.should.have.deep.property(1, review[1]).property('userId').eql('8');
//           res.body.Reviews.should.have.deep.property(1, review[1]).property('businessId').eql('2');
//           res.body.error.should.be.eql(false);
//           done();
//         });
//     });
//
//
//     it('it should GET empty reviews if reviews does not exists', (done) => {
//       const review = [
//         {
//           id: 1,
//           userId: '3',
//           businessId: '2',
//         },
//         {
//           id: 7,
//           userId: '8',
//           businessId: '2',
//         },
//       ];
//
//       // Passing review to review model
//       Reviews.push(review[0]);
//       Reviews.push(review[1]);
//       chai.request(app)
//         .get('/v1/businesses/1/reviews')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.Reviews.should.be.a('array');
//           res.body.should.have.property('Reviews');
//           res.body.Reviews.length.should.be.eql(0);
//           res.body.error.should.be.eql(false);
//           done();
//         });
//     });
//   });
//
//   describe('/POST review', () => {
//     it('it should not POST a review without a response, userId, businessId', (done) => {
//       const review = {
//         id: 1,
//         response: '',
//         userId: '',
//         businessId: '',
//       };
//
//       chai.request(app)
//         .post('/v1/businesses/2/reviews')
//         .send(review)
//         .end((err, res) => {
//           res.should.have.status(206);
//           res.body.should.be.a('object');
//           res.body.should.have.property('message').eql('Incomplete field');
//           res.body.should.have.property('error').eql(true);
//           done();
//         });
//     });
//
//     it('it should post a review', (done) => {
//       const review = {
//         id: 1,
//         response: 'very good.',
//         userId: '3',
//         businessId: '2',
//       };
//
//       chai.request(app)
//         .post('/v1/businesses/2/reviews')
//         .send(review)
//         .end((err, res) => {
//           res.should.have.status(201);
//           res.body.should.be.a('object');
//           res.body.should.have.property('Reviews');
//           res.body.Reviews.should.have.property('id').eql(1);
//           res.body.Reviews.should.have.property('response').eql('very good.');
//           res.body.Reviews.should.have.property('userId').eql('3');
//           res.body.Reviews.should.have.property('businessId').eql('2');
//           res.body.should.have.property('message').eql('Success');
//           res.body.should.have.property('error').eql(false);
//           done();
//         });
//     });
//   });
// });
