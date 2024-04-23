const express = require('express');
const router = express.Router();
const trajetCtrl = require('../controllers/trajetCtrl');
router.post('/trajet', trajetCtrl.createTrajet);
router.get('/getAlltrajet', trajetCtrl.getAllTrajets);
router.delete('/trajet/:id', trajetCtrl.deleteTrajet);

module.exports = router;