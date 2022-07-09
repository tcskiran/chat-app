var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const server = require('../backend/server');
const removeUser = require('../backend/controllers/userController').removeUser;

chai.use(chaiHttp);

describe('Testing backend of users', function () {
  describe('Checking Login...', () => {
    it('correct credentials', (done) => {
      let loginCred = { email: 'luffy@email.com', password: 'luffy' };
      chai
        .request(server)
        .post('/api/users/login')
        .send(loginCred)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });

    it('wrong password', (done) => {
      let loginCred = { email: 'luffy@email.com', password: 'fluffy' };
      chai
        .request(server)
        .post('/api/users/login')
        .send(loginCred)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          res.body.message.should.equal('Invalid credentials');
          done();
        });
    });

    it('user does not exist', (done) => {
      let loginCred = { email: 'luffy@email.com', password: 'fluffy' };
      chai
        .request(server)
        .post('/api/users/login')
        .send(loginCred)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          res.body.message.should.equal('Invalid credentials');
          done();
        });
    });

    it('email not confirmed', (done) => {
      let loginCred = { email: 'gojo@email.com', password: 'gojo' };
      chai
        .request(server)
        .post('/api/users/login')
        .send(loginCred)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          res.body.message.should.equal('Please confirm your email');
          done();
        });
    });

    it('email/password not filled', (done) => {
      let loginCred = { email: 'luffy@email.com' };
      chai
        .request(server)
        .post('/api/users/login')
        .send(loginCred)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.equal('Fill both fields');
          done();
        });
    });
  });

  describe('Checking Register...', () => {
    afterEach(function () {
      removeUser('tester123@email.com');
    });

    it('correct credentials', (done) => {
      let registerCred = {
        name: 'tester123',
        email: 'tester123@email.com',
        password: 'tester123',
        passwordCheck: 'tester123',
      };
      chai
        .request(server)
        .post('/api/users/register')
        .send(registerCred)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });

    it('passwords not same', (done) => {
      let registerCred = {
        name: 'tester123',
        email: 'tester123@email.com',
        password: 'tester123',
        passwordCheck: 'tester1234',
      };
      chai
        .request(server)
        .post('/api/users/register')
        .send(registerCred)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.equal('Passwords not same');
          done();
        });
    });

    it('fields not filled', (done) => {
      let registerCred = {
        name: 'tester123',
        email: 'tester123@email.com',
        password: 'tester123',
      };
      chai
        .request(server)
        .post('/api/users/register')
        .send(registerCred)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.equal('Fill all fields');
          done();
        });
    });

    it('account already exists', (done) => {
      let registerCred = {
        name: 'tester123',
        email: 'luffy@email.com',
        password: 'tester123',
        passwordCheck: 'tester123',
      };
      chai
        .request(server)
        .post('/api/users/register')
        .send(registerCred)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.equal('User already exists');
          done();
        });
    });
  });

  describe('Email verification...', () => {
    var token;
    beforeEach(function (done) {
      let registerCred = {
        name: 'tester123',
        email: 'tester123@email.com',
        password: 'tester123',
        passwordCheck: 'tester123',
      };
      chai
        .request(server)
        .post('/api/users/register')
        .send(registerCred)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    afterEach(function () {
      removeUser('tester123@email.com');
    });

    it('correct credentials', (done) => {
      chai
        .request(server)
        .get(`/api/users/confirmation/${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });

    it('tampered/expired token', (done) => {
      chai
        .request(server)
        .get(`/api/users/confirmation/${token}1`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          res.body.message.should.equal('Email token is tampered or expired');
          done();
        });
    });
  });

  describe('Get Users...', () => {
    it('get all users', (done) => {
      chai
        .request(server)
        .get('/api/users/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('users');
          done();
        });
    });
  });
});
