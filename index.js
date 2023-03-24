import express from 'express';
import connectDatabase from './src/database/db.js';
import userRoute from './src/routes/user.route.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 27017;

connectDatabase();
app.use(express.json());
app.use('/user', userRoute);

app.listen(port, () => console.log(`Server listen on port ${port}`));