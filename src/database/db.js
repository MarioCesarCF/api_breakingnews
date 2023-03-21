const mongoose = require('mongoose');
require('dotenv').config()
const URI = process.env.URI;

const connectDatabase = () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected on Atlas.'))
    .catch((error) => console.log(error));

}

module.exports = connectDatabase;