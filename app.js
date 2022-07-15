const path = require('path');
const express = require('express');
const connectDB = require('./src/config/database');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Config
dotenv.config();
const PORT = process.env.PORT || 1202;
connectDB();
const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// // Session
// app.use(
//   session({
//     cookie: { maxAge: 7200000 },
//     secret: 'funky mc',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//     }),
//   })
// );

// Body-parser
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Routes
app.use('/', require('./src/routes'));

// Static
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Running
app.listen(PORT, console.log(`${process.env.NODE_ENV} port ${PORT}`));
