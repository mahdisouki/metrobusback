const express = require('express');
const router = express.Router();
const stationCtrl = require('../controllers/stationCtrl');
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')
router.post('/station', auth, authAdmin, stationCtrl.createStation);
router.get('/getAllStations', stationCtrl.getAllStations);
router.delete('/deletestation/:id', auth, authAdmin, stationCtrl.deleteStation);

module.exports = router;