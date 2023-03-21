const express = require('express');
require('dotenv').config()
const app = express();
const connectDatabase = require('./src/database/db');

const userRoute = require('./src/routes/user.route');

const port = process.env.PORT || 3000;
connectDatabase();

app.use(express.json());

app.use('/user', userRoute);


app.listen(port, () => console.log(`Server listen port ${port}`));