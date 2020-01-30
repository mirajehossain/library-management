const bcrypt = require('bcryptjs');

const { UserModel } = require('../models/user');
const response = require('../helpers/response');
const middleware = require('../middleware/index');
const { userType } = require('../config/constants');

module.exports = {
  async login(req, res) {
    try {
      const payload = req.body;
      const user = await UserModel.findOne({ email: payload.email }).lean();
      if (user) {
        console.log(user);
        const matched = bcrypt.compareSync(payload.password, user.password);

        if (matched) {
          const tokenObject = {
            _id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
          };

          const accessToken = middleware.authentication.generateToken(tokenObject);
          return res.status(200).send(response.success('Successfully logged-in', { accessToken, ...user }));
        }
        return res.status(200).json(response.error(false, 'Incorrect email or password', 'Incorrect email or password '));
      }
      return res.status(200).send(response.success('User not exist', {}, false));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async register(req, res) {
    try {
      const payload = req.body; // email, password, name,

      console.log(payload);

      payload.password = bcrypt.hashSync(payload.password, Number(process.env.SALT_ROUND));
      payload.userType = userType.member; // admin, member

      const isEmailExist = await UserModel.findOne({ email: payload.email });
      if (!isEmailExist) {
        const user = await UserModel.create(payload);
        const tokenObject = {
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        };

        const accessToken = middleware.authentication.generateToken(tokenObject);
        return res.status(200).send(response.success('Successfully registered', { accessToken }));
      }
      return res.status(200).json(response.error('Email already used', 'Email already used'));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async registerAdmin(req, res) {
    try {
      const payload = req.body; // email, password, name,

      console.log(payload);

      payload.password = bcrypt.hashSync(payload.password, Number(process.env.SALT_ROUND));
      payload.userType = userType.admin; // admin, member

      const isEmailExist = await UserModel.findOne({ email: payload.email });
      if (!isEmailExist) {
        const user = await UserModel.create(payload);
        const tokenObject = {
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        };

        const accessToken = middleware.authentication.generateToken(tokenObject);
        return res.status(200).send(response.success('Successfully registered new adminn', { accessToken }));
      }
      return res.status(200).json(response.error('Email already used', 'Email already used'));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

};
