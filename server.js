const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const trajetRoutes = require('./routes/trajetRoute');
const notificationRoutes = require('./routes/notificationRoute');
const stationRoutes = require('./routes/stationRoute') // Assurez-vous que le chemin est correct


require('dotenv').config();


const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));           // Apply CORS with the options

// Middleware to parse body data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());           // Note: bodyParser.json() is somewhat redundant with express.json()

// Define routes
app.use('/trajet', trajetRoutes);
app.use('/notification', notificationRoutes);
app.use('/user', userRoute)
app.use('/station', stationRoutes);

// Database connection setup (ensure this does what's expected)
require('./db/cnx');

// Listen to requests
app.listen(5000, () => console.log("Server is running on port 5000"));

