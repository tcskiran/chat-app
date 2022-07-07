var assert = require('assert');
const loginUser = require('../backend/controllers/userController').loginUser;
let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../backend/server');
let should = chai.should();

chai.use(chaiHttp);

describe('Login', function () {
  describe('/POST login', () => {
    it('it should login', (done) => {
      let loginCred = { email: 'luffy@email.com', password: 'luff' };
      chai
        .request(server)
        .post('/api/users/login')
        .send(loginCred)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          // res.body.errors.pages.should.have.property('kind').eql('required');
          done();
        });
    });
  });
});
