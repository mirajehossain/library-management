const response = require('../../helpers/response');

const validatorMiddleware = (schema, property) => async (req, res, next) => {
  try {
    // property = 'body', 'query', 'params'
    const value = await schema.validateAsync(req[property]);

    if (value) {
      req.validatedData = value;
      return next();
    }

    return res.status(422).send(response.error('Unprocessable entity'));
  } catch (e) {
    return res.status(422).send(response.error(e.message, 'An error occur'));
  }
};
module.exports = validatorMiddleware;
