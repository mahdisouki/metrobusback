const Ticket = require("../models/Ticket.model");

const TicketCtrl = {
  createTicket: async (req, res) => {
    try {
      const { trajet, dateReservation } = req.body;
      const user = req.user.id; // Ensure this is correctly obtained
      const newTicket = new Ticket({ trajet, user, dateReservation });
      await newTicket.save();
      res.status(201).json(newTicket);
    } catch (error) {
      console.error("Detailed Error:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
  getUserTickets: async (req, res) => {
    try {
      console.log(req.user.id)
      const userId = req.user.id;

      const userTickets = await Ticket.find({ user: userId }).populate("trajet", "-_id -createdAt -updatedAt -__v -Type");
      res.json(userTickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
