const mongoose = require('mongoose');

const ratingavisSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }

});

const RatingAvis = mongoose.model('Ratingavis', ratingavisSchema);

module.exports = RatingAvis;