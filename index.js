const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { registerUser, loginUser } = require('./Controllers/authController');
const errorHandler = require('./Middleware/error-handler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*'
}));

require("dotenv").config();

const url = process.env.DB_URL;

const connectionParams = {
  useNewUrlParser: true
}

async function ConnectToDB() {
  await mongoose.connect(url, connectionParams)
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Connection Failed'));
}

ConnectToDB();

app.get('/', (req, res) => {
  res.send('Server is Live!');
})

// Routes
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);

// error-handling middlewaqre
app.use(errorHandler);


app.listen(5000, () => {
  console.log('Server started on port 5000');
});
