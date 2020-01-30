const Joi = require('@hapi/joi');

module.exports = {

  createAuthor: Joi.object({
    name: Joi.string().trim().min(3).max(30)
      .required()
      .error(() => new Error('"name" is required should at least 3 and maximum 30 characters long.')),
    mobile: Joi.number(),
    email: Joi.string().email().required(),
  }),

  updateAuthor: Joi.object({
    name: Joi.string(),
    mobile: Joi.number(),
    email: Joi.string().email(),
    image: Joi.string(),
  }),

};
