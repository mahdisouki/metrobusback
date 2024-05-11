const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");
const authAdmin = require("../auth/authAdmin");
const TicketCtrl = require("../controllers/ticketCtrl");
router.post("/create", auth, TicketCtrl.createTicket);
router.get("/userTickets", auth, TicketCtrl.getUserTickets);

module.exports = router;
