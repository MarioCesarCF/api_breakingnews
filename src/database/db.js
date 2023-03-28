import mongoose from 'mongoose';

const connectDatabase = () => {
  console.log("Wait connecting to the database...");

  const URI = process.env.MONGODB_URI;

  mongoose.set('strictQuery', false);
  mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected on Atlas.'))
    .catch((error) => console.log(error));

}

export default connectDatabase;