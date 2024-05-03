const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const RatingAvis = require("../models/rating-avis.model");

const ratingavisCtrl = {
    createratingavis: async (req, res) => {
        try {
            const { number, description } = req.body;
            const user = req.user.id

            const newRatingavis = new RatingAvis({ user: user, number, description });
            await newRatingavis.save();
            res.status(201).json(newRatingavis);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    getAllRatingAvis: async (req, res) => {
        try {
            const ratingavis = await RatingAvis.find().populate("user", "-_id -createdAt -updatedAt -__v -photo -password");
            res.status(200).json(ratingavis);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getRatingSummary: async (req, res) => {
        try {
            const ratingSummary = await RatingAvis.aggregate([
                {
                    $group: {
                        _id: "$number",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);
            res.status(200).json(ratingSummary);
        } catch (error) {
            console.error("Error fetching rating summary: ", error);
            res.status(500).json({ message: "Error fetching rating summary: " + error.message });
        }
    }
};



module.exports = ratingavisCtrl
