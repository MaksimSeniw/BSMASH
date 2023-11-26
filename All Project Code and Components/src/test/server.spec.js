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

  //We are checking POST /register API by passing the user info in the correct order. This test case should pass and redirect to the login page
  //Positive case
  it('positive : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({ first_name: 'John', last_name: 'Doe', username: 'test', password: 'test', favorite_type: 'fedora', email: 'test@user.com' })
      .redirects(0) // To capture the redirect response
      .end((err, res) => {
        expect(res).to.have.status(302); // Expecting a redirect
        res.should.redirectTo('/login');
        done();
      });
  });

  //We are checking POST /register API by passing incorrect user info, this test should pass and redirect to a failed to insert message on register
  //Negative case
  it('negative : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({ first_name: 'John', last_name: 'Doe', username: "", password: 'test', favorite_type: 'fedora', email: 'test@user.com' })
      .redirects(0) // To capture the redirect response
      .end((err, res) => {
        expect(res).to.have.status(302); // Expecting a redirect
        res.should.redirectTo(`/register?error=true&message=${encodeURIComponent("Failed to insert user into database")}`); 
        done();
      });
  });


  //We are checking POST /login API by passing the user info in the correct order. This test case should pass and redirect to the items page
  //Positive cases
  it('positive : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({ username: 'test', password: 'test' })
      .redirects(0) // To capture the redirect response
      .end((err, res) => {
        expect(res).to.have.status(302); // Expecting a redirect
        res.should.redirectTo('/items');
        done();
      });
  });

  //We are checking POST /login API by passing the user info incorrectly. This test case should pass and redirect to the login with an incorrect username or password message
  //Positive cases
  it('negative : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({ username: 'test', password: 'incorrect' })
      .redirects(0) // To capture the redirect response
      .end((err, res) => {
        expect(res).to.have.status(302); // Expecting a redirect
        expect(res).to.redirectTo('/login?error=true&message=' + encodeURIComponent('Incorrect Username or Password'));
        done();
      });
  });
  

  // ===========================================================================
  // TO-DO: Part A Login unit test case
});