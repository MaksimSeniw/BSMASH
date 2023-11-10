// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
var bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

// get register
app.get('/register', (req, res) => {
    res.render("pages/register",{
        error: req.query.error,
        message: req.query.message,
    })
  });

// post register
app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
  
    // To-DO: Insert username and hashed password into the 'users' table

    const query = `insert into customers (username, password) values ($1,$2)  returning *;`;
    db.any(query, [
        req.body.username,
        hash
    ])
    .then(function (data) {
            res.redirect('/login');
            })
        // if query execution fails
        // send error message

        .catch(function (err) {
            res.redirect(`/register?error=true&message=${encodeURIComponent("Failed to insert user into database")}`)
            return console.log(err);
        });
    });

// get login
    app.get('/login', (req, res) => {
        res.render("pages/login",{
            error: req.query.error,
            message: req.query.message,
        })
      });

// post login
      app.post('/login', (req, res) => {

        const query = `select password from customers where username =  $1;`;    
       
        db.one(query, [
            req.body.username
        ])
        .then(async function(user) {

                const match = await bcrypt.compare(req.body.password, user.password);
                //save user details in session like in lab 8
                
                if(match == true)
                {
                    req.session.user = user;
                    req.session.save();

                    console.log(user);
                    res.redirect('/discover');
                }
                // else
                // {
                //     res.render('pages/login',{
                //     error: true,
                //     message: "Incorrect Password"
                //     });
                // }
            })
            // if query execution fails
            // send error message
            .catch(function (err) {
              res.render('pages/login',{
                error: true,
                message: "Incorrect Username or Password"
                });
                return console.log(err);
            });
        });

// Authentication Middleware.
const auth = (req, res, next) => {
    if (!req.session.user) {
      // Default to login page.
      return res.redirect('/login');
    }
    next();
  };
  
  // Authentication Required
  app.use(auth);
  
// get home
app.get('/home', (req, res) => {
  res.render("pages/home",{
      error: req.query.error,
      message: req.query.message,
  })
});

// logout
    app.get("/logout", (req, res) => {
        req.session.destroy();
        res.render("pages/login",{
            message: "Logged out Successfully"
        }); 
      });
      
//discover
app.get('/discover', (req, res) => {
 
  const results = [
    {
      name: "Event 1",
      date: "2023-11-15",
      description: "This is the first event description.",
    },
    {
      name: "Event 2",
      date: "2023-12-05",
      description: "This is the second event description.",
    },
    // the above is just an example; you could add more
  ]; 

 
  res.render('pages/discover', { results });
});

      

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');