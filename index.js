const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/database');

// Config
dotenv.config();
const PORT = process.env.PORT || 1202;
connectDB();
const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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
  app.use(express.static('./frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Running
app.listen(PORT, console.log(`${process.env.NODE_ENV} port ${PORT}`));
