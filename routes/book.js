const express = require('express');
const { authentication, joiValidator } = require('../middleware/index')
const schema = require('../schema/index');
const { JOI } = require('../config/constants');

const router = express.Router();

const BookController = require('../controllers/book');

router.route('/').get((req, res) => res.json({ title: 'Hello world, Welcome to library API' }));

router.route('/:pageNo').get(
  authentication.isMember,
  BookController.getBooks,
);

router.route('/').post(
  authentication.isAdmin,
  joiValidator(schema.bookSchema.createBook, JOI.property.body),
  BookController.createBook,
);

router.route('/:bookId').patch(
  authentication.isAdmin,
  joiValidator(schema.bookSchema.updateBook, JOI.property.body),
  BookController.updateBook,
);

router.route('/:bookId').delete(
  authentication.isAdmin,
  joiValidator(schema.bookSchema.deleteBook, JOI.property.params),
  BookController.deleteBook,
);

router.route('/request-book').post(
  authentication.isMember,
  joiValidator(schema.bookSchema.requestForBook, JOI.property.body),
  BookController.requestForBook,
);

router.route('/request-book/:userId').get(
  authentication.isMember,
  BookController.bookRequests,
);


module.exports = router;
