const Joi = require('@hapi/joi');

module.exports = {
  createBook: Joi.object({
    bookType: Joi.string().required(),
    authorName: Joi.string().required(),
    title: Joi.string().required(),
    publications: Joi.string().required(),
  }),

  updateBook: Joi.object({
    bookType: Joi.string(),
    authorName: Joi.string(),
    title: Joi.string(),
    publications: Joi.string(),
  }),

  deleteBook: Joi.object({
    bookId: Joi.string().required(),
  }),

  requestForBook: Joi.object({
    bookId: Joi.string().required(),
    userId: Joi.string().required(),
  }),

  updateBookRequest: Joi.object({
    status: Joi.string().required(),
  }),
};
