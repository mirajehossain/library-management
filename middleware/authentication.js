const jwt = require('jsonwebtoken');
const response = require('../helpers/response');
const { UserModel } = require('../models/user');
const { userType } = require('../config/constants');

module.exports = {
  async validateToken(req, res, next) {
    try {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        req.decoded = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        return next();
      }

      console.error('Authorization header is not set');
      return res.status(401).send(response.error('Unauthorized User', 'You are not authenticate user'));
    } catch (e) {
      console.error(e.message);
      return res.status(401).send(response.error('Unauthorized User', e.message));
    }
  },

  generateToken(data) {
    return jwt.sign(data, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,
    });
  },

  async isAdmin(req, res, next) {
    try {
      const user = await UserModel.findOne({ _id: req.decoded._id });

      if (user && (user.userType === userType.admin)) {
        return next();
      }

      return res.status(401).send(response.error('User is not able to perform this action', 'Unauthorized, User is not able to perform this action'));
    } catch (e) {
      return res.status(401).send(response.error('An error occur', e.message));
    }
  },

  async isMember(req, res, next) {
    try {
      const user = await UserModel.findOne({ _id: req.decoded._id });

      if (user && (user.userType === userType.member || userType.admin)) {
        return next();
      }

      return res.status(401).send(response.error('User is not able to perform this action', 'Unauthorized, User is not able to perform this action'));
    } catch (e) {
      return res.status(401).send(response.error('An error occur', e.message));
    }
  },


};
