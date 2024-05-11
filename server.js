const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const trajetRoutes = require('./routes/trajetRoute');
const notificationRoutes = require('./routes/notificationRoute');
const stationRoutes = require('./routes/stationRoute')
const ticketRoutes = require('./routes/ticketRoute')
const ratingavisRoutes = require('./routes/rating-avisRoute')
const dashboardRoutes = require('./routes/dashboardRoute')

require('dotenv').config();


const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));           // Apply CORS with the options

// Middleware to parse body data
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "500mb" }));           // Note: bodyParser.json() is somewhat redundant with express.json()

// Define routes
app.use('/trajet', trajetRoutes);
app.use('/notification', notificationRoutes);
app.use('/user', userRoute)
app.use('/station', stationRoutes);
app.use('/ratingavis', ratingavisRoutes);
app.use('/ticket', ticketRoutes);
app.use('/dashboard', dashboardRoutes);

// Database connection setup (ensure this does what's expected)
require('./db/cnx');

// Listen to requests
app.listen(5000, () => console.log("Server is running on port 5000"));

