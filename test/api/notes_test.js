'use strict';
process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('Wom backend tests', function() {
  var email = 'test1234@example.com';
  it('should be unable to create an user with passwordConfrim fails', function(done) {
    chai.request('localhost:3000') //change this
    .post('/api/users')
    .send({'email': email,
           'password': 'foobar123',
           'passwordConfrim': 'foobar1234'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.be.eql('passwords did not match');
      done();
    });
  });

  it('should be able to create an user, with a token sent back', function(done) {
    chai.request('localhost:3000') //change this
    .post('/api/users')
    .send({'email': email,
           'password': 'foobar123',
           'passwordConfirm': 'foobar123'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      done();
    });
  });

  it('should be able to login with existing email and a token sent back', function(done) {
    chai.request('localhost:3000') //change this
    .get('/api/users')
    .auth(email,'foobar123')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      done();
    });
  });

  it('should be unable to create an existing user', function(done) {
    chai.request('localhost:3000') //change this
    .post('/api/users')
    .send({'email': email,
           'password': 'foobar123',
           'passwordConfirm': 'foobar123'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.be.eql('cannot create that user');
      done();
    });
  });
});
