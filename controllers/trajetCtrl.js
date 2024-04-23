const Trajet = require('../models/Trajet.model');

const trajetCtrl = {
    createTrajet: async (req, res) => {
        try {
            const { depart, arrivee, tempsDepart, tempsArrivee } = req.body;
            const newTrajet = new Trajet({ depart, arrivee, tempsDepart, tempsArrivee });
            await newTrajet.save();
            res.status(201).json(newTrajet);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    deleteTrajet: async (req, res) => {
        try {
            const result = await Trajet.findByIdAndDelete(req.params.id);
            if (!result) {
                return res.status(404).json({ message: "Trajet non trouvé" });
            }
            res.status(200).json({ message: "Trajet supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAllTrajets: async (req, res) => {
        try {
            const trajet = await Trajet.find();
            res.status(200).json(trajet);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

};




module.exports = trajetCtrl;

