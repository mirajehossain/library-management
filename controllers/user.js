const path = require('path');
const { UserModel } = require('../models/user');
const response = require('../helpers/response');
const { userType } = require('../config/constants');

module.exports = {
  async createAuthor(req, res) {
    try {
      const payload = req.body;
      const user = await UserModel.findOne({ email: payload.email }).lean();
      payload.userType = userType.author;

      if (user) {
        return res.status(200).send(response.success('Author already create with this email', {}, false));
      }

      const author = await UserModel.create(payload);
      return res.status(200).send(response.success('New author created', author, true));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getAuthor(req, res) {
    try {
      const { authorId } = req.params;
      const author = await UserModel.find({ _id: authorId, userType: userType.author });
      return res.status(200).send(response.success('Author profile', author, true));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getMember(req, res) {
    try {
      const { userId } = req.params;
      const member = await UserModel.findOne({ _id: userId });
      return res.status(200).send(response.success('Member profile', member, true));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async updateAuthor(req, res) {
    try {
      const { authorId } = req.params;
      const payload = req.body;
      const user = await UserModel.findOne({ _id: authorId }).lean();

      if (!user) {
        return res.status(200).send(response.success('Author not found', {}, false));
      }

      const author = await UserModel.findOneAndUpdate({ _id: authorId }, payload, { new: true });
      return res.status(200).send(response.success('Author updated', author, true));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },


  async deleteAuthor(req, res) {
    try {
      const { authorId } = req.params;
      const user = await UserModel.findOne({ _id: authorId }).lean();

      if (!user) {
        return res.status(200).send(response.success('Author not found', {}, false));
      }

      await UserModel.findOneAndRemove({ _id: authorId });
      return res.status(200).send(response.success('Author deleted successfully'));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async uploadImage(req, res) {
    try {
      const { userId } = req.params;
      const user = await UserModel.findOne({ _id: userId }).lean();

      if (!user) {
        return res.status(200).send(response.success('User not found', {}, false));
      }

      const fileName = req.file.originalname;
      const sourcePath = `http://${path.join(`${req.headers.host}/${fileName}`)}`;

      const updatedUser = await UserModel
        .findOneAndUpdate({ _id: userId }, { image: sourcePath }, { new: true });

      return res.status(200).send(response.success('Profile image upload successfully', updatedUser));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },


};
