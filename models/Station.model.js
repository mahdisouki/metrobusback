const mongoose = require("mongoose");
const StationSchema = new mongoose.Schema({
    nom_station: String,
}
);
module.exports = mongoose.model("station", StationSchema); 