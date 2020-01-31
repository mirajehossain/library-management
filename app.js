const express = require('express');
const path = require('path');

const app = express();
require('dotenv').config();
const cors = require('cors');
const server = require('http').createServer(app);

const { authentication } = require('./middleware/index');

const port = process.env.PORT || 8000;

const indexRoute = require('./routes/index');
const AuthRoute = require('./routes/auth');
const UserRoute = require('./routes/users');
const BookRoute = require('./routes/books');
const BookLoanRoute = require('./routes/book-loans');
const AuthorRoute = require('./routes/authors');

require('./config/database').connection();

const corsOptions = {
  origin: true,
  methods: 'GET, POST, DELETE, PATCH, PUT, HEAD',
  credentials: true,
};

// application middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use('/', express.static(path.join(`${__dirname}/uploads`)));


// Routing
app.use('/api', indexRoute);
app.use('/api/auth/', AuthRoute);
app.use('/api/v1/*', authentication.validateToken);
app.use('/api/v1/users', UserRoute);
app.use('/api/v1/authors', AuthorRoute);
app.use('/api/v1/books', BookRoute);
app.use('/api/v1/book-loans', BookLoanRoute);

/**
 * Unhandled promise rejection handler
 */
process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection at:', reason);
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
});

/**
 * 404 not found route
 */
app.use((req, res) => res.status(404).send({ error: 'Not Found' }));

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
server.listen(port, () => {
  console.info(`Server is running on ${process.env.HOST}:${process.env.PORT}`);
});


module.exports = app;
