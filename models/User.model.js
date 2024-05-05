const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    photo: String,
    role: { type: String, default: 'user' }
}, {
    timestamps: true
}
);
module.exports = mongoose.model("user", UserSchema);