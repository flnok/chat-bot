const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const { connect, set } = require('mongoose');
const {
  IndexRouter,
  AuthRouter,
  BookingRouter,
  IntentRouter,
  InternalRouter,
  QueryRouter,
} = require('./src/routes');
const { errorMiddleware } = require('./src/middleware');
const { mongoURI, secret } = require('./src/config');

class Index {
  constructor(routes) {
    this.app = express();
    this.env = process.env.NODE_ENV;
    this.port = process.env.PORT || 1202;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.info(`=================================`);
      console.info(`======= ENV: ${this.env} =======`);
      console.info(`🚀 App listening on the port ${this.port}`);
      console.info(`=================================`);
    });
  }

  connectToDatabase() {
    if (process.env.NODE_ENV !== 'production') {
      set('debug', true);
    }

    connect(mongoURI);
  }

  initializeMiddlewares() {
    if (this.env === 'development') {
      this.app.use(morgan('dev'));
    }
    this.app.use(cors({ origin: '*' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(
      session({
        cookie: { maxAge: 3600000 },
        secret: secret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
        }),
      }),
    );
  }

  initializeRoutes(routes) {
    routes.forEach(route => {
      this.app.use('/api', route.router);
    });
    if (this.env === 'production') {
      this.app.use(express.static('./frontend/build'));
      this.app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
      });
    }
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

// Running
const app = new Index([
  new IndexRouter(),
  new AuthRouter(),
  new BookingRouter(),
  new IntentRouter(),
  new InternalRouter(),
  new QueryRouter(),
]);
app.listen();
