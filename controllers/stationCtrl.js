const Station = require('../models/Station.model');

const stationCtrl = {
    createStation: async (req, res) => {
        try {
            const { nom_station } = req.body;
            const newStation = new Station({ nom_station });
            await newStation.save();
            res.status(201).json(newStation);
        } catch (error) {
            res.status(400).json({ message: error.message });
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
};




module.exports = stationCtrl;