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
  email: undefined,
  cart_id: undefined
};

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

app.get('/welcometest', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/', (req, res) => {
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
  res.render("pages/register", {
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
  const query = `INSERT INTO customers (customer_id, first_name, last_name, username, password, funds_avail, favorite_type, email, cart_id) VALUES (DEFAULT, '${req.body.first_name}', '${req.body.last_name}', '${req.body.username}', '${hash}', 100.00, '${req.body.favorite_type}', '${req.body.email}', ${newCartId})  RETURNING *;`;
  if (req.body.username != "") {
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
  else {
    res.redirect(`/register?error=true&message=${encodeURIComponent("Failed to insert user into database")}`);
    console.log('error');
  }
});

app.get('/', (req, res) => {
  res.redirect("pages/login");
});

// get login
app.get('/login', (req, res) => {
  res.render("pages/login", {
    error: req.query.error,
    message: req.query.message,
  })
});

// post login
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = `SELECT * FROM customers WHERE username = $1`;

  try {
    const user = await db.oneOrNone(query, [username]);

    if (user && await bcrypt.compare(password, user.password)) {
      // Set user session and redirect to items page
      req.session.user = {
        customer_id: user.customer_id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        password: user.password,
        funds_avail: user.funds_avail,
        favorite_type: user.favorite_type,
        email: user.email,
        cart_id: user.cart_id
      };
      req.session.save();
      return res.redirect('/items');
    } else {
      // Handle login failure
      console.log("Error: Incorrect Username or Password");
      return res.redirect('/login?error=true&message=' + encodeURIComponent('Incorrect Username or Password'));
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.redirect('/login?error=true&message=' + encodeURIComponent('An error occurred during login'));
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
    email: req.session.user.email,
    cart_id: req.session.user.cart_id,
    error: req.query.error,
    message: req.query.message,
  });
});

// logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("pages/login", {
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

app.post("/cart/add", async (req, res) => {
  const item_id = parseInt(req.body.item_id);
  const cart_id = parseInt(req.session.user.cart_id);
  const quantity = parseInt(req.body.quantity);

  // Check if the item already exists in the cart
  const checkQuery = `SELECT * FROM cart_lines WHERE cart_id = ${cart_id} AND item_id = ${item_id};`;
  const existingItem = await db.oneOrNone(checkQuery);

  if (existingItem) {
    // Update the quantity of the existing item
    const newQuantity = existingItem.quantity + quantity;
    const updateQuery = `UPDATE cart_lines SET quantity = ${newQuantity} WHERE cart_id = ${cart_id} AND item_id = ${item_id};`;
    await db.none(updateQuery);
  } else {
    // Insert the new item
    const insertQuery = `INSERT INTO cart_lines (line_id, cart_id, item_id, quantity) VALUES (DEFAULT, ${cart_id}, ${item_id}, ${quantity});`;
    await db.none(insertQuery);
  }

  res.redirect(`/items?error=false&message=${encodeURIComponent("Successfully updated cart")}`);
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

// app.get("/cart", (req, res) => {
//   const query = `SELECT * FROM items INNER JOIN cart_lines ON items.item_id = cart_lines.item_id WHERE cart_id = ${req.session.user.cart_id}`;

//   db.any(query)
//     .then((data) => {
//       res.render("pages/cart", {
//         cart_lines: data,
//         error: req.query.error,
//         message: req.query.message,
//       });
//     })
//     .catch((err) => {
//       res.render("pages/cart", {
//         cart_lines: [],
//         error: req.query.error,
//         message: req.query.message,
//       });
//     });
// });
// NEW CHANGES START HERE


app.get("/cart", async (req, res) => {
  try {
      const cartQuery = `SELECT * FROM items INNER JOIN cart_lines ON items.item_id = cart_lines.item_id WHERE cart_id = ${req.session.user.cart_id}`;
      const savedForLaterQuery = `SELECT * FROM items INNER JOIN saved_for_later ON items.item_id = saved_for_later.item_id WHERE customer_id = ${req.session.user.customer_id}`;

      const [cartData, savedForLaterData] = await Promise.all([
          db.any(cartQuery),
          db.any(savedForLaterQuery)
      ]);

      res.render("pages/cart", {
          cart_lines: cartData,
          saved_for_later: savedForLaterData, 
          error: req.query.error,
          message: req.query.message,
      });
  } catch (error) {
      console.error("Error fetching data for cart:", error);
      res.render("pages/cart", {
          cart_lines: [],
          saved_for_later: [], 
          error: req.query.error,
          message: req.query.message,
      });
  }
});





app.post("/cart/move-to-cart", async (req, res) => {
  const item_id = parseInt(req.body.item_id);
  const customer_id = req.session.user.customer_id;

  try {
      
      const removeFromSavedQuery = `DELETE FROM saved_for_later WHERE customer_id = ${customer_id} AND item_id = ${item_id};`;
      await db.none(removeFromSavedQuery);

     
      const addToCartQuery = `INSERT INTO cart_lines (cart_id, item_id, quantity) VALUES (${req.session.user.cart_id}, ${item_id}, 1) RETURNING *;`;
      await db.one(addToCartQuery);

      res.redirect("/cart");
  } catch (error) {
      console.error("Error moving item to cart:", error);
      res.redirect("/cart?error=true&message=Failed to move item to cart");
  }
});


app.post("/cart/delete-saved-item", async (req, res) => {
  const item_id = parseInt(req.body.item_id);
  const customer_id = req.session.user.customer_id;

  try {
     
      const deleteFromSavedQuery = `DELETE FROM saved_for_later WHERE customer_id = ${customer_id} AND item_id = ${item_id};`;
      await db.none(deleteFromSavedQuery);

      res.redirect("/cart");
  } catch (error) {
      console.error("Error deleting item from Saved For Later:", error);
      res.redirect("/cart?error=true&message=Failed to delete item from Saved For Later");
  }
});


app.post("/cart/save-for-later", async (req, res) => {
  const item_id = parseInt(req.body.item_id);
  const customer_id = req.session.user.customer_id;

  try {
      
      const removeFromCartQuery = `DELETE FROM cart_lines WHERE cart_id = ${req.session.user.cart_id} AND item_id = ${item_id};`;
      await db.none(removeFromCartQuery);


      const addToSavedQuery = `INSERT INTO saved_for_later (customer_id, item_id, quantity) VALUES (${customer_id}, ${item_id}, 1) RETURNING *;`;
      await db.one(addToSavedQuery);

      res.redirect("/cart");
  } catch (error) {
      console.error("Error saving item for later:", error);
      res.redirect("/cart?error=true&message=Failed to save item for later");
  }
});





// NEW CHANGES END HERE
app.post("/orders/create", async (req, res) => {

  const itemCostQuery = `SELECT items.item_price, cart_lines.quantity FROM items JOIN cart_lines ON cart_lines.item_id = items.item_id
  WHERE cart_lines.cart_id = ${req.session.user.cart_id};`

  const itemCosts = await db.any(itemCostQuery);
  var orderTotal = 0;
  itemCosts.forEach((item) => orderTotal += (item.item_price * item.quantity));
  if (req.session.user.funds_avail - orderTotal < 0) {
    res.redirect(`/orders?error=true&message=${encodeURIComponent("Failed to create order - Insufficient funds")}`);
  }
  else {
    const currentDate = new Date().toDateString();
    const parsedZip = parseInt(req.body.shipping_zip);
    const createOrderQuery = `INSERT INTO orders (order_id, order_date, shipping_address, shipping_city, shipping_state, shipping_country, shipping_zip, order_total, cart_id) VALUES (DEFAULT, '${currentDate}', '${req.body.shipping_address}', '${req.body.shipping_city}', '${req.body.shipping_state}', '${req.body.shipping_country}', ${parsedZip}, ${orderTotal}, ${req.session.user.cart_id}) RETURNING *;`;

    var newOrderId = 0;
    await db.any(createOrderQuery)
      .then((data) => {
        newOrderId = data[0].order_id;
        //res.redirect(`/orders?error=false&message=${encodeURIComponent("Successfully created order")}`);
      })
      .catch((err) => {
        res.redirect(`/orders?error=true&message=${encodeURIComponent("Failed to create order")}`);
      });

    const itemsQuery = `INSERT INTO order_lines (order_id, item_id, quantity) SELECT ${newOrderId}, item_id, quantity FROM cart_lines WHERE cart_id = ${req.session.user.cart_id};`;
    await db.any(itemsQuery)
      .then((data) => {
        console.log("added order lines");
      })
      .catch((err) => {
        res.redirect(`/orders?error=true&message=${encodeURIComponent("Failed to create order")}`);
      });

    const deleteQuery = `DELETE FROM cart_lines WHERE cart_id = ${req.session.user.cart_id};`;
    await db.any(deleteQuery)
      .then((data) => {
        req.session.user.funds_avail -= orderTotal;
        res.redirect(`/orders?error=false&message=${encodeURIComponent("Successfully created order")}`);
      })
      .catch((err) => {
        res.redirect(`/orders?error=true&message=${encodeURIComponent("Failed to create order")}`);
      });
  }

  // const {name, email} = req.body;
  //implement your spam protection or checks.
  sendEmail();
  // sendEmail(name, email);

});

app.post("/orders/delete", async (req, res) => {
  const linesQuery = `DELETE FROM order_lines WHERE order_id = ${req.body.order_id};`;
  const orderQuery = `DELETE FROM orders WHERE order_id = ${req.body.order_id};`;

  await db.any(linesQuery);

  db.any(orderQuery)
    .then((data) => {
      res.redirect(`/orders?error=false&message=${encodeURIComponent("Successfully removed order")}`);
    })
    .catch((err) => {
      res.redirect(`/orders?error=true&message=${encodeURIComponent("Failed to remove order")}`);
    });
});

app.get("/orders", (req, res) => {
  const query = `SELECT * FROM orders WHERE cart_id = ${req.session.user.cart_id};`;

  db.any(query)
    .then((data) => {
      res.render("pages/orders", {
        orders: data,
        error: req.query.error,
        message: req.query.message,
      });
    })
    .catch((err) => {
      res.render("pages/orders", {
        orders: [],
        error: req.query.error,
        message: req.query.message,
      });
    });
});



//edit profile
app.get('/edit_profile', (req, res) => {
  res.render("pages/edit_profile", {
    error: req.query.error,
    message: req.query.message,
  })
});
//posting edited profile
app.post('/edit_profile', async (req, res) => {

  var username = "";
  var first_name = "";
  var last_name = "";
  var favorite_type = "";
  var email = "";
  var funds_avail = 0.0;
  var password = "";

  if (req.body.first_name != "") {
    first_name = req.body.first_name;
  }
  else {
    first_name = req.session.user.first_name;
  }
  if (req.body.last_name != "") {
    last_name = req.body.last_name;
  }
  else {
    last_name = req.session.user.last_name;
  }
  if (req.body.username != "") {
    username = req.body.username;
  }
  else {
    username = req.session.user.username;
  }
  if (req.body.favorite_type != "") {
    favorite_type = req.body.favorite_type;
  }
  else {
    favorite_type = req.session.user.favorite_type;
  }

  if (req.body.email != "") {
    email = req.body.email;
  }
  else {
    email = req.session.user.email;
  }

  if(req.body.funds_avail != ""){
    funds_avail = parseFloat(req.session.user.funds_avail) + parseFloat(req.body.funds_avail);
    console.log(parseFloat(req.body.funds_avail));
    console.log(req.session.user.funds_avail);
    console.log(parseFloat(req.session.user.funds_avail) + parseFloat(req.body.funds_avail));
  }
  else{
    funds_avail = req.session.user.funds_avail;
  }

  if (req.body.password != "") {
    password = await bcrypt.hash(req.body.password, 10);
  }
  else {
    const passQuery = await db.one(`SELECT password FROM customers WHERE username = '${req.session.user.username}';`);
    password = passQuery.password;
  }


  const query = `UPDATE customers 
    SET first_name = '${first_name}', last_name = '${last_name}', username = '${username}', favorite_type = '${favorite_type}', email = '${email}', funds_avail = ${funds_avail}, password = '${password}'
    WHERE customer_id = '${req.session.user.customer_id}'
    RETURNING *;`;

  console.log(req.session.user.customer_id);

  db.one(query)
    .then((data) => {
      res.redirect(`/logout?error=false&message=${encodeURIComponent("Successfully update profile. Please login again.")}`);
    })
    .catch((err) => {
      res.redirect(`/profile?error=true&message=${encodeURIComponent("Failed to update profile information")}`);
      return console.log(err);
    }); 
});

// Email Api

async function sendEmail() {
  const data = JSON.stringify({
    "Messages": [{
      "From": {"Email": "sadr1181@colorado.edu", "Name": "Saul"},
      "To": [{"Email": "sauldrantch@gmail.com", "Name": "Saul"}],
      "Subject": "test",
      "TextPart": "hello"
    }]
  });

  const config = {
    method: 'post',
    url: 'https://api.mailjet.com/v3.1/send',
    data: data,
    headers: {'Content-Type': 'application/json'},
    auth: {username: 'ca8b49fd4eba3dc0c6c9e14f2451acf1', password: 'a1f1f3d498a0d2c23a09f87fe75c8197'},
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

}


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');