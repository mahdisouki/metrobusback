const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    trajet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trajet",
    },
    dateReservation: {
        type: Date,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },

}, {
    timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
