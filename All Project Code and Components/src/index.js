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

const user = {
  customer_id: undefined,
  first_name: undefined,
  last_name: undefined,
  username: undefined,
  funds_avail: undefined,
  favorite_type: undefined,
  cart_id: undefined
}

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
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const query = `SELECT * FROM customers WHERE username = '${username}'`;
  await db.one(query, username)
    .then((data) => {
      user.customer_id = data.customer_id;
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.username = data.username;
      user.password = data.password;
      user.funds_avail = data.funds_avail;
      user.favorite_type = data.favorite_type;
      user.cart_id = data.cart_id;
    })
    .catch((err) => {
      console.log('Error accessing the DB');
      console.log(err);
      res.redirect('/login');
    });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    req.session.user = user;
    req.session.save();
  }
  else {
    console.log("Error: Incorrect Username or Password")
  }

  if (user.username != "") {
    res.redirect('/discover');
  }
  else {
    res.redirect('/register');
  }

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
  
//get profile
app.get("/profile", (req, res) => {
  res.render("pages/profile", {
    customer_id: req.session.user.customer_id,
    first_name: req.session.user.first_name,
    last_name: req.session.user.last_name,
    username: req.session.user.username,
    funds_avail: req.session.user.funds_avail,
    favorite_type: req.session.user.favorite_type,
    cart_id: req.session.user.cart_id,
  });
});

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

//get items page
app.get("/items", (req, res) => {
  const query = `SELECT * FROM items`;
  // Query to list all the courses taken by a student

  db.one(query)
    .then((items) => {
      res.render("pages/items", {
        items
      });
    })
    .catch((err) => {
      res.render("pages/items", {
        items: [],
        error: true,
        message: err.message,
      });
    });
});

//add to cart
app.post("/cart/add", (req, res) => {
  const item_id = parseInt(req.body.item_id);
  const cart_id = parseInt(req.session.user.cart_id);
  const quantity = parseInt(req.body.quantity);
  const query = `INSERT INTO cart_lines (line_id, cart_id, item_id, quantity) VALUES (DEFAULT, ${cart_id}, ${item_id}, ${quantity});`;

  db.one(query)
  .then((data) => {
    res.redirect("/items", {
      message: `Successfully added items to cart`,
    });
  })
  .catch((err) => {
    res.redirect("/items", {
      error: true,
      message: err.message,
    });
  });
});

app.get('/welcometest', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');