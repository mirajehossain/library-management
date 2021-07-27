process.env.NODE_ENV = 'test';
// Require the dev-dependencies
const chai = require('chai');
const bcrypt = require('bcryptjs');

const chaiHttp = require('chai-http');
const { UserModel } = require('../models/user');
const { BookModel } = require('../models/book');
const server = require('../app');
const { userType, bookType } = require('../config/constants');

chai.should();
let author;
let user;
let token;


chai.use(chaiHttp);

beforeEach(async () => { // Before each test we empty the database
  await BookModel.remove();
  await UserModel.remove();
  const payload = {
    name: 'Miraje',
    mobile: '01922073355',
    email: 'miraajehossain@gmail.com',
    userType: userType.author,
  };
  author = await UserModel.findOne({ email: payload.email })
    .lean();
  payload.userType = userType.author;

  if (!author) {
    author = await UserModel.create(payload);
  }


  const userPayload = {
    name: 'Alamin',
    mobile: '01922073366',
    email: 'mmiraje@gmail.com',
    userType: userType.admin,
    password: bcrypt.hashSync('123456', Number(process.env.SALT_ROUND)),
  };

  user = await UserModel.findOne({ email: userPayload.email })
    .lean();

  if (!user) {
    user = await UserModel.create(userPayload);
  }
});


describe('/POST login', () => {
  it('LOGIN', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({
        email: 'mmiraje@gmail.com',
        password: '123456',
      })
      .end((err, res) => {
        token = `Bearer ${res.body.data.accessToken}`;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
});

/*
 * Test the /POST route
 */
describe('/POST book', () => {
  it('it should create a Book', (done) => {
    const book = {
      title: 'The Lord of the Rings',
      publications: 'J.R.R. Pub',
      bookType: bookType.science,
      authorId: author._id,
    };

    chai.request(server)
      .post('/api/v1/books')
      .set('Authorization', token)
      .send(book)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
});
/*
   * Test the /GET route
   */
describe('/GET book', () => {
  it('it should GET all the books', (done) => {
    chai.request(server)
      .get('/api/v1/books')
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('array');
        done();
      });
  });
});


