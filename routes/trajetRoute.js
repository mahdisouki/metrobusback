const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')
const trajetCtrl = require('../controllers/trajetCtrl');
router.post('/createtrajet', auth, authAdmin, trajetCtrl.createTrajet);
router.get('/getAlltrajet', trajetCtrl.getAllTrajets);
router.delete('/deletetrajet/:id', auth, authAdmin, trajetCtrl.deleteTrajet);
router.put('/updateTrajet/:id', auth, authAdmin, trajetCtrl.updateTrajet);

module.exports = router;