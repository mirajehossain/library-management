const mongoose = require('mongoose');
require('dotenv').config();

const connectionURI = process.env.DB_URL;
module.exports = {
  connection() {
    mongoose.connect(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true }, (e) => {
      if (e) {
        console.error('Could not connect to DB ', e);
        throw e;
      }

      console.log('mongodb is connected');
    });
  },

};
