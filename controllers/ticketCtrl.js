const Ticket = require('../models/Ticket.model');

const TicketCtrl = {
    createTicket: async (req, res) => {
        try {
            const { trajet, dateReservation } = req.body;
            const user = req.user.id
            const Date = new Date(dateReservation);
            const utcDateReservation = Date.toISOString();

            const newTicket = new Ticket({ trajet: trajet, user: user, dateReservation: utcDateReservation });
            await newTicket.save();
            res.status(201).json(newTicket);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAllTickets: async (req, res) => {
        try {
            const Tickets = await Ticket.find().populate("trajet", "-_id -createdAt -updatedAt -__v -Type");
            res.json(Tickets);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    deleteTicket: async (req, res) => {
        try {
            const result = await Ticket.findByIdAndDelete(req.params.id);
            if (!result) {
                return res.status(404).json({ message: "Ticket non trouvé" });
            }
            res.status(200).json({ message: "Ticket supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};




module.exports = TicketCtrl;