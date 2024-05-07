const users = require("../models/User.model")
const tickets = require('../models/Ticket.model')
const avis = require('../models/rating-avis.model')
const trajets = require('../models/Trajet.model')
const jwt = require('jsonwebtoken')


const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const dashboardCtrl = {
    getStatCards: async (req, res) => {
        try {
            const user = await users.find({ role: 'user' });
            const ticket = await tickets.find();
            const aviss = await avis.find();
            res.json({ users: user.length, tickets: ticket.length, avis: aviss.length })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getUserDataByMonth: async (req, res) => {
        try {
            const currentYear = new Date().getFullYear(); // Get the current year

            const months = Array.from({ length: 12 }, (_, i) => {
                return { month: i + 1 }; // Generate an array of objects representing each month
            });

            const userData = await users.aggregate([
                {
                    $match: {
                        createdAt: { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1) } // Filter documents for the current year
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" }, // Group by month of the 'createdAt' field
                        numberOfUsers: { $sum: 1 }    // Count users
                    }
                }
            ]);

            // Left join the aggregated data with the array of months
            const result = months.map(monthObj => {
                const monthInfo = userData.find(item => item._id === monthObj.month);
                return {
                    month: monthObj.month,
                    monthName: monthNames[monthObj.month - 1], // Get the month name from an array of month names (see below)
                    numberOfUsers: monthInfo ? monthInfo.numberOfUsers : 0
                };
            });

            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user data by month", error: error.message });
        }
    },
    getUserSatisfaction: async (req, res) => {
        try {
            // Count the number of satisfied and dissatisfied users based on the ratings
            const userSatisfactionData = await avis.aggregate([
                {
                    $group: {
                        _id: null,
                        satisfiedUsers: { $sum: { $cond: { if: { $gte: ["$number", 3] }, then: 1, else: 0 } } }, // Count users with rating number >= 3 as satisfied
                        dissatisfiedUsers: { $sum: { $cond: { if: { $lt: ["$number", 3] }, then: 1, else: 0 } } } // Count users with rating number < 3 as dissatisfied
                    }
                }
            ]);

            // Extract the results from the aggregation output
            const userSatisfaction = userSatisfactionData[0] || { satisfiedUsers: 0, dissatisfiedUsers: 0 };

            res.json(userSatisfaction);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user satisfaction data", error: error.message });
        }
    },
    getRatingCount: async (req, res) => {
        try {
            // Count the number of users for each rank number
            const rankNumberData = await avis.aggregate([
                {
                    $group: {
                        _id: "$number", // Group by rank number
                        numberOfUsers: { $sum: 1 } // Count users for each rank number
                    }
                },
                {
                    $sort: { "_id": 1 } // Sort by rank number
                }
            ]);

            // Create an array to hold the data for each rank number
            const rankNumberStats = Array.from({ length: 5 }, (_, i) => {
                const rankNumber = i + 1; // Rank numbers are from 1 to 5
                const rankNumberInfo = rankNumberData.find(item => item._id === rankNumber); // Find the data for the current rank number
                return {
                    rankNumber: rankNumber,
                    numberOfUsers: rankNumberInfo ? rankNumberInfo.numberOfUsers : 0 // If no data found for the rank number, set users to 0
                };
            });

            res.json(rankNumberStats);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user rank number data", error: error.message });
        }
    },
    getTicketsByDayInWeek: async (req, res) => {
        try {
            const currentDate = new Date(); // Get the current date
            const currentWeekStart = currentDate.getDate() - currentDate.getDay(); // Get the start date of the current week (Sunday)
            const currentWeekEnd = currentWeekStart + 7; // Get the end date of the current week

            const days = Array.from({ length: 7 }, (_, i) => {
                return { day: i }; // Generate an array of objects representing each day of the week
            });

            const ticketData = await tickets.aggregate([
                {
                    $match: {
                        dateReservation: { $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentWeekStart), $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentWeekEnd) } // Filter documents for the current week
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$dateReservation" },
                        numberOfTickets: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id": 1 } // Assurez-vous que les résultats sont triés par jour de la semaine
                }
            ]);


            // Left join the aggregated data with the array of days
            const result = [];
            for (let i = 1; i <= 7; i++) {
                const found = ticketData.find(day => day._id === i);
                result.push({
                    day: i,
                    dayName: dayNames[i - 1],
                    numberOfTickets: found ? found.numberOfTickets : 0
                });
            }

            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving ticket data by day in week", error: error.message });
        }
    },
    getTopReservedTrajets: async (req, res) => {

        try {
            const { type } = req.params.id;

            const topTrajets = await tickets.aggregate([
                {
                    $lookup: {
                        from: "trajets",
                        localField: "trajet",
                        foreignField: "_id",
                        as: "trajetDetails"
                    }
                },
                {
                    $match: {
                        "trajetDetails.Type": req.params.id
                    }
                },
                {
                    $group: {
                        _id: "$trajet", // Group by trajet ObjectId
                        numberOfReservations: { $sum: 1 }
                    }
                },
                {
                    $sort: { numberOfReservations: -1 }
                },
                {
                    $limit: 3
                }
            ]);

            // Fetch trajet names for the top trajets
            const topTrajetIds = topTrajets.map(trajet => trajet._id);
            const trajetDetails = await trajets.find({ _id: { $in: topTrajetIds } });

            // Combine trajet names with reservation counts
            const result = topTrajets.map(trajet => {
                const trajetDetail = trajetDetails.find(item => item._id.equals(trajet._id));
                const trajetName = `${trajetDetail.depart}-${trajetDetail.arrivee}`;
                return {
                    trajet: trajetName,
                    numberOfReservations: trajet.numberOfReservations
                };
            });

            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving top reserved trajets by type", error: error.message });
        }

    }

}


module.exports = dashboardCtrl