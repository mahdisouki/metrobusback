const users = require("../models/Admin.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminCtrl = {
  register: async (req, res) => {
    try {
      const { name, lastName, email, password } = req.body;
      const user = await users.findOne({ email });
      if (user) return res.status(400).json({ msg: 'The email already exists.' });

      if (password.length < 6)
        return res.status(400).json({ msg: 'Password is at least 6 characters long.' });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new users({
        name,
        lastName,
        email,
        password: passwordHash
      });
      await newUser.save();

      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      res.json({ accesstoken });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await users.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User does not exist.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Incorrect password.' });

      const accesstoken = createAccessToken({ id: user._id });
      res.json({ accesstoken });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  UpdateUser: async (req, res) => {
    try {
      const { name, lastName, email, password } = req.body;
      let update = { name, lastName, email };
      if (password) {
        update.password = await bcrypt.hash(password, 10);
      }
      await users.findOneAndUpdate({ _id: req.params.id }, update);
      res.json({ msg: "User updated" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.cookie('refreshtoken', '', { expires: new Date(0) });
      res.status(200).json({ msg: "Logged out successfully." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const allUsers = await users.find();
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

const createAccessToken = user => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || "defaultsecret", { expiresIn: '11m' });
};

const createRefreshToken = user => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || "defaultsecret", { expiresIn: '7d' });
};

module.exports = adminCtrl;
