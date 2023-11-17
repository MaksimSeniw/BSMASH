// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcometest')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  //We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
  //Positive cases
  it('positive : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({ first_name: 'John', last_name: 'Doe', username: 'test', password: 'test', favorite_type: 'fedora' })
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        res.should.redirectTo('/login');
        done();
      });
  });

  //We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
  //Positive cases
  it('negative : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({ first_name: 'John', last_name: 'Doe', username: "", password: 'test', favorite_type: 'fedora', email: 'test@user.com' })
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        res.should.redirectTo(`/register?error=true&message=${encodeURIComponent("Failed to insert user into database")}`);
        done();
      });
  });


  //We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
  //Positive cases
  it('positive : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({ username: 'test', password: 'test' })
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        res.should.redirectTo('/items');
        done();
      });
  });

  //We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
  //Positive cases
  it('negative : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({ username: 'test', password: 'incorrect' })
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        res.should.redirectTo('/login')
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case
});