const Trajet = require('../models/Trajet.model');

const trajetCtrl = {
    createTrajet: async (req, res) => {
        try {
            const { depart, arrivee, tempsDepart, tempsArrivee, Type, prix } = req.body;

            const trajet = await Trajet.findOne({ depart: depart, arrivee: arrivee, tempsArrivee: tempsArrivee, tempsDepart: tempsDepart, Type: Type })


            const newTrajet = new Trajet({ depart, arrivee, tempsDepart, tempsArrivee, Type, prix });
            await newTrajet.save();
            res.status(201).json(newTrajet);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    updateTrajet: async (req, res) => {
        const { id } = req.params;
        const { depart, arrivee, tempsDepart, tempsArrivee, Type, prix } = req.body;

        try {
            const updatedTrajet = await Trajet.findByIdAndUpdate(id, {
                depart, arrivee, tempsDepart, tempsArrivee, Type, prix
            }, { new: true, runValidators: true });

            if (!updatedTrajet) {
                return res.status(404).json({ msg: "Trajet not found" });
            }

            res.json({ msg: "Trajet updated successfully", trajet: updatedTrajet });
        } catch (error) {
            console.error('Error updating trajet:', error);
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

