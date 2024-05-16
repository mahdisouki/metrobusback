const users = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "mahdisouki88@gmail.com",
    pass: "agvv thgz nvnc twlc",
  },
});

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, lastName, email, password, photo } = req.body;
      const user = await users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "the email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "password is at least 6 characters long ." });
      //password encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new users({
        name,
        lastName,
        photo,
        email,
        password: passwordHash,
      });
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

      const user = await users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "user does not exist." });
      if (user.role !== "user") {
        return res.status(403).json({ msg: "inccorect information." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });
      res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await users.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
      }
      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ msg: "Access denied: You are not an administrator." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password" });
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
      console.log(update, password);
      await users.findOneAndUpdate({ _id: req.user.id }, update);
      res.json({ msg: "User updated" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  UpdateUser: async (req, res) => {
    console.log(req.user.id)
    try {

      const { name, lastName, email, password, photo } = req.body;
      let update = { name, lastName, email, photo };
      if (password !== "") {
        update.password = await bcrypt.hash(password, 10);
      }
      await users.findOneAndUpdate(
        { _id: req.user.id }, update
      );
      res.json({ msg: "updated user" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
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
  getUserById: async (req, res) => {
    const id = req.user.id
    try {
      console.log(id)
      const user = await users.findById(id);
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.send(user);
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).send('Internal Server Error');
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { code, email } = req.body;

      // Check if the email exists in the database
      const user = await users.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Email not found" });
      }

      // Send the verification code
      const info = await transporter.sendMail({
        from: 'metrobushelp@gmail.com',
        to: email, // list of receivers
        subject: "Verification Code", // Subject line
        text: `This is your verification code: ${code}`, // plain text body
      });

      res.json({ msg: "Email is sent successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },
  updatePassword: async (req, res) => {
    console.log("Request received to update password:", req.body);
    try {
      const { email, newPassword, code } = req.body;

      if (!email || !newPassword || !code) {
        return res.status(400).json({ msg: "Please provide email, new password, and verification code." });
      }

      const user = await users.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
      }


      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.password = passwordHash;
      await user.save();

      res.json({ success: true, msg: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ msg: error.message });
    }
  },

};
const createAccessToken = (user) => {
  return jwt.sign(user, "metrobus123", { expiresIn: "365d" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, "metrobus123", { expiresIn: "365d" });
};

module.exports = userCtrl;
