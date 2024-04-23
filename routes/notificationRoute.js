const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notificationCtrl');

router.post('/notification', notificationCtrl.createnotification);
router.delete('/deletenotification/:id', notificationCtrl.deleteNotification);
router.get('/getAllnotification', notificationCtrl.getAllNotification);

module.exports = router;
