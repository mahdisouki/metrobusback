const Station = require('../models/Station.model');

const stationCtrl = {
    createStation: async (req, res) => {
        try {
            const { nom_station } = req.body;
            const station = await Station.findOne({ nom_station })
            if (station)
                return res.status(400).json({ msg: 'la station est deja existée .' })
            const newStation = new Station({ nom_station });
            await newStation.save();
            res.status(201).json(newStation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAllStations: async (req, res) => {
        try {
            const stations = await Station.find();
            res.json(stations);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    deleteStation: async (req, res) => {
        try {
            const result = await Station.findByIdAndDelete(req.params.id);
            if (!result) {
                return res.status(404).json({ message: "station non trouvé" });
            }
            res.status(200).json({ message: "station supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};




module.exports = stationCtrl;