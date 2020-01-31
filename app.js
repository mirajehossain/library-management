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
const UserRoute = require('./routes/user');
const BookRoute = require('./routes/book');

require('./config/database').connection();

const corsOptions = {
  origin: true,
  methods: 'GET, POST, DELETE, PATCH, PUT, HEAD',
  credentials: true,
};

// applicaiton middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use('/', express.static(path.join(`${__dirname}/uploads`)));


// Routing
app.use('/', indexRoute);
app.use('/api/auth/', AuthRoute);
app.use('/api/v1/*', authentication.validateToken);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/book', BookRoute);

server.listen(port, () => {
  console.info(`Server is running on ${process.env.HOST}:${process.env.PORT}`);
});


module.exports = app;
