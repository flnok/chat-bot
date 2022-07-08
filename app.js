const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Config
dotenv.config();
const PORT = process.env.PORT || 1202;
// connectDB();
const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// // Flash
// app.use(flash());

// // Handlebars
// app.set('views', path.join(__dirname, 'src/views'));
// app.engine(
//   'hbs',
//   exphbs({
//     helpers: {
//       formatDate,
//       getIdYoutube,
//       showOptions,
//       stripTags,
//       truncate,
//       mappingDepartmentName,
//       getNumberByDepartmentName,
//     },
//     defaultLayout: 'main',
//     extname: '.hbs',
//   })
// );

// const Handlebars = exphbs.create({});
// Handlebars.handlebars.registerHelper(
//   'ifContentHadYoutube',
//   function (content, options) {
//     if (content) {
//       if (
//         content.includes('www.youtube.com/') ||
//         content.includes('youtu.be/')
//       ) {
//         return options.fn(this);
//       }
//       return options.inverse(this);
//     }
//   }
// );
// Handlebars.handlebars.registerHelper(
//   'ifYouOwnPost',
//   function (postUser, user, postId, options) {
//     if (postUser && user) {
//       if (postUser._id == user._id) {
//         return options.fn(this);
//       } else {
//         return options.inverse(this);
//       }
//     }
//   }
// );
// Handlebars.handlebars.registerHelper(
//   'ifYouAreNotDepartmentRole',
//   function (user, options) {
//     if (user.role === 'department') {
//       return options.fn(this);
//     } else {
//       return options.inverse(this);
//     }
//   }
// );

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
