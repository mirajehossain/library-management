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

server.listen(port, () => {
  console.info(`Server is running on ${process.env.HOST}:${process.env.PORT}`);
});


module.exports = app;
