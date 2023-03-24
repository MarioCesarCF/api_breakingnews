import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const URI = process.env.URI;

const connectDatabase = () => {
  console.log("Wait connecting to the database...");
  
  mongoose.set('strictQuery', false);
  mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected on Atlas.'))
    .catch((error) => console.log(error));

}

export default connectDatabase;