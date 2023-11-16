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
const path = require('path');

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
};

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

app.get('/', (req,res) => {
  res.redirect('/login');
});

//get an image from directory
app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, './resources/img', imageName);

  // Send the image file as a response
  res.sendFile(imagePath);
});

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
    const newCartQuery = `INSERT INTO carts (cart_id) VALUES (DEFAULT) RETURNING *;`;
    const newCartResult = await db.one(newCartQuery);
    const newCartId = newCartResult.cart_id;

    // To-DO: Insert username and hashed password into the 'users' table
    const query = `INSERT INTO customers (customer_id, first_name, last_name, username, password, funds_avail, favorite_type, cart_id) VALUES (DEFAULT, '${req.body.first_name}', '${req.body.last_name}', '${req.body.username}', '${hash}', 100.00, '${req.body.favorite_type}', ${newCartId})  RETURNING *;`;
    if(req.body.username != ""){
      db.one(query)
      .then((data) => {
              res.redirect('/login');
              })
          // if query execution fails
          // send error message

          .catch((err) => {
              res.redirect(`/register?error=true&message=${encodeURIComponent("Failed to insert user into database")}`);
              return console.log(err);
          });
      }
      else{
        res.redirect(`/register?error=true&message=${encodeURIComponent("Failed to insert user into database")}`);
        console.log('error');
      }
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
    console.log("Error: Incorrect Username or Password");
  }

  if (user.username != "") {
    res.redirect('/items');
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

// logout
    app.get("/logout", (req, res) => {
        req.session.destroy();
        res.render("pages/login",{
            message: "Logged out Successfully"
        }); 
      });

//get items page
app.get("/items", (req, res) => {
  const query = 'SELECT * FROM items;';

  db.any(query)
    .then((data) => {
      console.log("success");
      res.render("pages/items", {
        items: data,
        error: req.query.error,
        message: req.query.message,
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("failure");
      res.render("pages/items", {
        items: [],
        error: req.query.error,
        message: req.query.message,
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
    res.redirect(`/cart?error=false&message=${encodeURIComponent("Successfully deleted from cart")}`);
  })
  .catch((err) => {
    res.redirect(`/cart?error=false&message=${encodeURIComponent("Successfully deleted from cart")}`);
  });
});

app.post("/cart/delete", (req, res) => {
  const item_id = parseInt(req.body.item_id);
  const cart_id = parseInt(req.session.user.cart_id);
  const query = `DELETE FROM cart_lines WHERE cart_id = ${cart_id} AND item_id = ${item_id};`;

  db.one(query)
  .then((data) => {
    res.redirect(`/cart?error=false&message=${encodeURIComponent("Successfully deleted from cart")}`);
  })
  .catch((err) => {
    res.redirect(`/cart?error=true&message=${encodeURIComponent("Failed to delete from cart")}`);
  });
});

app.get("/cart", (req, res) => {
  const query =  `SELECT * FROM items INNER JOIN cart_lines ON items.item_id = cart_lines.item_id WHERE cart_id = ${req.session.user.cart_id}`;

  db.any(query)
    .then((data) => {
      res.render("pages/cart", {
        cart_lines: data,
        error: req.query.error,
        message: req.query.message,
      });
  })
  .catch((err) => {
    res.render("pages/cart", {
      cart_lines: [],
      error: req.query.error,
      message: req.query.message,
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
//module.exports = 
app.listen(3000);
console.log('Server is listening on port 3000');