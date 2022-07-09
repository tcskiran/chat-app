var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const server = require('../backend/server');
const deleteMessage =
  require('../backend/controllers/messageController').deleteMessage;

chai.use(chaiHttp);

describe('Testing backend for message', function () {
  describe('Add message', (done) => {
    var token, messageId;
    before(function (done) {
      let loginCred = { email: 'luffy@email.com', password: 'luffy' };
      chai
        .request(server)
        .post('/api/users/login')
        .send(loginCred)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    after(function () {
      deleteMessage(messageId);
    });

    it('Sending message', (done) => {
      let messageData = { message: 'Cool dude', emailTo: 'gojo@email.com' };
      chai
        .request(server)
        .post('/api/messages/message')
        .set({ Authorization: `Bearer ${token}` })
        .send(messageData)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.messageFrom.should.equal('luffy');
          res.body.messageTo.should.equal('gojo');
          messageId = res.body._id;
          done();
        });
    });

    it('Sending empty message', (done) => {
      let messageData = { message: '', emailTo: 'gojo@email.com' };
      chai
        .request(server)
        .post('/api/messages/message')
        .set({ Authorization: `Bearer ${token}` })
        .send(messageData)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.equal(
            'Please enter a message before sending'
          );
          done();
        });
    });
  });

  describe('Getting messages between users', (done) => {
    var token;
    before(function (done) {
      let loginCred = { email: 'luffy@email.com', password: 'luffy' };
      chai
        .request(server)
        .post('/api/users/login')
        .send(loginCred)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('Getting messages', (done) => {
      let messageData = { email1: 'gojo@email.com' };
      chai
        .request(server)
        .post('/api/messages/')
        .set({ Authorization: `Bearer ${token}` })
        .send(messageData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name1');
          res.body.name1.should.equal('gojo');
          res.body.name2.should.equal('luffy');
          done();
        });
    });
  });
});
