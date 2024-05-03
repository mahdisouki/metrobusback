const express = require('express');
const router = express.Router();
const auth = require('../auth/auth')
const authAdmin = require('../auth/authAdmin');
const TicketCtrl = require('../controllers/ticketCtrl');
router.post('/create', auth, TicketCtrl.createTicket);
router.get('/getAll', TicketCtrl.getAllTickets);
// router.delete('/deletestation/:id', auth, authAdmin, stationCtrl.deleteStation);

module.exports = router;