const users = require("../models/User.model")
const tickets = require('../models/Ticket.model')
const avis = require('../models/rating-avis.model')
const trajets = require('../models/Trajet.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const monthNames = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, lastName, email, password, photo } = req.body;
      const user = await users.findOne({ email })
      if (user)
        return res.status(400).json({ msg: 'the email already exists.' })

      if (password.length < 6)
        return res.status(400).json({ msg: 'password is at least 6 characters long .' })
      //password encryption
      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = new users({
        name, lastName, photo, email, password: passwordHash
      })
      await newUser.save();

      const accesstoken = createAccessToken({ id: newUser._id });

      res.json({ accesstoken });

      //  res.json({msg : 'Register Success'})
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }

  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await users.findOne({ email })
      if (!user) return res.status(400).json({ msg: 'user does not exist.' })
      if (user.role !== "user") {
        return res.status(403).json({ msg: 'inccorect information.' });
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' })

      const accesstoken = createAccessToken({ id: user._id })
      const refreshtoken = createRefreshToken({ id: user._id })
      res.json({ accesstoken })

    } catch (error) {
      return res.status(500).json({ msg: error.message })
    }
  },


  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await users.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist.' });
      }
      if (user.role !== "admin") {
        return res.status(403).json({ msg: 'Access denied: You are not an administrator.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Incorrect password' });
      }

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });
      res.json({ accesstoken, role: user.role });

    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  UpdateAdmin: async (req, res) => {
    try {
      const { name, lastName, email, password } = req.body;
      let update = { name, lastName, email };
      if (password != "") {
        update.password = await bcrypt.hash(password, 10);
      }
      console.log(update, password)
      await users.findOneAndUpdate({ _id: req.user.id }, update);
      res.json({ msg: "User updated" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  UpdateUser: async (req, res) => {
    try {
      let passhash = null;
      const { name, lastName, email, password, photo } = req.body;
      if (password) {
        passhash = await bcrypt.hash(password, 10);
      }
      await users.findOneAndUpdate(({ _id: req.user.id }, { name, lastName, email, passhash, photo }))
      res.json({ msg: "updated user" })

    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  },
  deleteUser: async (req, res) => {
    try {
      const result = await users.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "user non trouvé" });
      }
      res.status(200).json({ message: "user supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const { role } = req.query;
      const query = role ? { role } : {};
      const allUsers = await users.find(query);
      res.json(allUsers);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getStatCards: async (req, res) => {
    try {
      const user = await users.find();
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
            _id: { $dayOfWeek: "$dateReservation" }, // Group by day of the week of the 'dateReservation' field
            numberOfTickets: { $sum: 1 }    // Count tickets
          }
        }
      ]);

      // Left join the aggregated data with the array of days
      const result = days.map(dayObj => {
        const dayInfo = ticketData.find(item => item._id === dayObj.day);
        return {
          day: dayObj.day,
          dayName: dayNames[dayObj.day], // Get the day name from an array of day names (see below)
          numberOfTickets: dayInfo ? dayInfo.numberOfTickets : 0
        };
      });

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
const createAccessToken = (user) => {
  return jwt.sign(user, "metrobus123", { expiresIn: '365d' })
}
const createRefreshToken = (user) => {
  return jwt.sign(user, "metrobus123", { expiresIn: '365d' })
}


module.exports = userCtrl