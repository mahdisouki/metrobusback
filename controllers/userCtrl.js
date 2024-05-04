const users = require("../models/User.model")
const tickets = require('../models/Ticket.model')
const avis = require('../models/rating-avis.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



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
      const passhash = null;
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
      const userData = await users.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month of the 'createdAt' field
            numberOfUsers: { $sum: 1 }    // Count users
          }
        },
        {
          $sort: { "_id": 1 } // Sort by month
        }
      ]);
      res.json(userData);
    } catch (error) {
      res.status(500).send({ message: "Error retrieving user data by month", error: error.message });
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