const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notificationCtrl');
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin')
router.post('/notification', auth, authAdmin, notificationCtrl.createnotification);
router.delete('/deletenotification/:id', notificationCtrl.deleteNotification);
router.get('/getAllnotification', notificationCtrl.getAllNotification);

module.exports = router;
