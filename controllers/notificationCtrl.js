const Notification = require('../models/Notification.model'); // Assurez-vous que le chemin est correct

const notificationCtrl = {
    createnotification: async (req, res) => {
        try {
            const { title, message } = req.body;
            const newNotification = new Notification({ title, message });
            await newNotification.save();
            res.status(201).json(newNotification);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    deleteNotification: async (req, res) => {
        try {
            const result = await Notification.findByIdAndDelete(req.params.id);
            if (!result) {
                return res.status(404).json({ message: "Notification non trouvé" });
            }
            res.status(200).json({ message: "Notification supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAllNotification: async (req, res) => {
        try {
            const notifications = await Notification.find();
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateNotify: async (req, res) => {
        const { id } = req.params;
        const { title, message } = req.body;

        try {
            const updateNotify = await Notification.findByIdAndUpdate(id, {
                title, message
            }, { new: true, runValidators: true });

            if (!updateNotify) {
                return res.status(404).json({ msg: "Notification not found" });
            }

            res.json({ msg: "Notification updated successfully", notification: updateNotify });
        } catch (error) {
            console.error('Error updating Notification:', error);
        }
    },
};
module.exports = notificationCtrl;
