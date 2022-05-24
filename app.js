const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
// const exphbs = require('express-handlebars');
// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const connectDB = require('./src/config/db');
// const cookieParser = require('cookie-parser');
// const flash = require('connect-flash');
// const methodOverride = require('method-override');
// const configPassport = require('./src/config/passport');

// Config
dotenv.config();
const PORT = process.env.PORT || 1202;
// connectDB();
const app = express();

// Socket io
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// io.on('connection', (socket) => {
//   console.log('New socker connected...');
//   socket.on('disconnect', () => console.log('Socket disconnect'));
//   socket.on('new post', () => io.emit('new post from server'));
//   socket.on('new notification', (data) =>
//     socket.broadcast.emit('new notification from server', data)
//   );
//   socket.on('edit notification', () =>
//     socket.broadcast.emit('delete or edit notification from server')
//   );
//   socket.on('delete notification', () =>
//     socket.broadcast.emit('delete or edit notification from server')
//   );
// });

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('http://localhost:1202/');
}

// // Flash
// app.use(flash());

// // Helpers
// const {
//   formatDate,
//   getIdYoutube,
//   showOptions,
//   stripTags,
//   truncate,
//   mappingDepartmentName,
//   getNumberByDepartmentName,
// } = require('./src/helpers/hbs');

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
// app.set('view engine', 'hbs');

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
app.use('/api', require('./src/api'));
// app.use('/users', require('./src/routes/users'));
// app.use('/posts', require('./src/routes/posts'));
// app.use('/notifications', require('./src/routes/notifications'));
// app.use('/comments', require('./src/routes/comments'));
// Static
app.use(express.static(path.join(__dirname, 'src/public')));

// Running
app.listen(
  PORT,
  console.log(`Running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
