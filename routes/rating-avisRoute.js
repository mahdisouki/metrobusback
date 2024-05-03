const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')

const ratingavisCtrl = require('../controllers/rating-avisCtrl');
router.post('/createratingavis', auth, ratingavisCtrl.createratingavis);
router.get('/getAllratingavis', ratingavisCtrl.getAllRatingAvis);
router.get('/ratingSummary', ratingavisCtrl.getRatingSummary);
module.exports = router;
