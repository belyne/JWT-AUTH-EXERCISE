// app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authmiddleware');

const app = express();
//const PORT = 5000;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

//const connectToDB = async () => {
//  await mongoose.connect('mongodb://127.0.0.1:27017/JWT-AUTH');
//  console.log('connected to Database');
//};

//connectToDB();

// Database connection
const dbURI = 'mongodb://localhost:27017/JWT-AUTH';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((result) => {
    console.log('connected to mongoDB');
    app.listen(3000, () => {
      console.log('server listening on http://localhost:3000');
    });
  })
  .catch((err) => console.log(err));

//app.listen(PORT, () => {
//  console.log(`sever running on http://localhost:${PORT}`);
//});


// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
