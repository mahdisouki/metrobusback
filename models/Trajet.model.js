const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
    depart: {
        type: String,
    },
    arrivee: {
        type: String,
    },
    tempsDepart: {
        type: String,
    },
    tempsArrivee: {
        type: String,
    }
}, {
    timestamps: true
});


const Trajet = mongoose.model('Trajet', trajetSchema);

module.exports = Trajet;
