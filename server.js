const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const app = express();
const items = require("./routes/api/items");
const users = require("./routes/api/users");
const carts = require("./routes/api/carts");
const orders = require("./routes/api/orders");
const passport = require("passport");
const cors = require("cors");
const port = process.env.PORT || 3002;

// Session:
const session = require("express-session");
app.use(session({
  secret: keys.secretOrKey,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } // One hour I believe
}));

// Stripe Middleware:
const stripe = require("stripe")("sk_test_0XQb2SgTnVlKehrZ1FDP8lcA00yFcgaoDL");

app.use(require("body-parser").text());

// Cors Middleware:
app.use(cors());

// Passport Middleware:
app.use(passport.initialize());

// Passport Config:
require("./config/passport.js")(passport);

// Body Parser:
// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB Config:
const mongoConfig = {
  useUnifiedTopology: true,
  useNewUrlParser: true, 
  useCreateIndex: true
}
// Connect To MongoDB:
const db = require("./config/keys").mongoURI;
const db_adrien = require("./config/keys").adrien;


// Routes:
app.use("/api/users", users);
app.use("/api/items", items);
app.use("/api/orders", orders);
app.use("/api/carts", carts);


// // Connect to Mongo:
mongoose.connect("mongodb+srv://adrien:" +db_adrien+ "@cluster0-lsnox.mongodb.net/my-node-database",{ useNewUrlParser: true })
// mongoose.connect("mongodb+srv://adrien:Sopiste34@cluster0-lsnox.mongodb.net/my-node-database?retryWrites=true")
    .then(() => {
      console.log("connected to database");
    })
    .catch(() => {
      console.log("Connection failed!");
    });

app.listen(port, () => console.log(`Server Running On Port: ${port}`));
