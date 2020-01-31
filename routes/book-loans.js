const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const schema = require('../schema/index');
const { JOI } = require('../config/constants');

const router = express.Router();

const BookController = require('../controllers/book');

router.route('/').get((req, res) => res.json({ title: 'Hello world, Welcome to library API' }));

// request for a book ->(member)
router.route('/request-book').post(
  authentication.isMember,
  joiValidator(schema.bookSchema.requestForBook, JOI.property.body),
  BookController.requestForBook,
);

// fetch pending book requests -> admin/member
router.route('/request-book/:userId').get(
  authentication.isMember,
  BookController.bookRequests,
);

// update requested book
router.route('/request-book/:bookRequestId').patch(
  authentication.isAdmin,
  joiValidator(schema.bookSchema.updateBookRequest, JOI.property.body),
  BookController.updateBookRequest,
);

// return book
router.route('/return-book/:userId/:bookId').patch(
  authentication.isAdmin,
  BookController.returnBook,
);

// generate excel sheet for book loans
router.route('/generate-excel').get(
  authentication.isAdmin,
  BookController.generateBookLoansExcel,
);

// get list of book loans
router.route('/:userId').get(
  authentication.isMember,
  BookController.getBookLoans,
);

module.exports = router;
