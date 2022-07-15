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

// // Flash
// app.use(flash());

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

// // Passport
// app.use(passport.initialize());
// app.use(passport.session());

// Body-parser
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
// app.use(cookieParser());

// // Method override
// app.use(methodOverride('_method'));

// Routes
app.use('/', require('./src/routes'));

// Static
app.use(express.static(path.join(__dirname, 'src/public')));

// Running
app.listen(
  PORT,
  console.log(`Running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
