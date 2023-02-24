const express = require('express');
const app = express();

const userRoute = require('./src/routes/user.route');

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/user', userRoute)

app.listen(port, () => console.log(`Server listen port ${port}`));