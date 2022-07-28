const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const cors = require('cors');
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

// Session
app.use(
  session({
    cookie: { maxAge: 720000 },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Body-parser
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

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
