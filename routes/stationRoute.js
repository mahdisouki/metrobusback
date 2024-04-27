const express = require('express');
const router = express.Router();
const stationCtrl = require('../controllers/stationCtrl');
router.post('/station', stationCtrl.createStation);
router.get('/getAllStations', stationCtrl.getAllStations);

module.exports = router;