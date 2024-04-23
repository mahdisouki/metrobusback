const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    id: String,
    name: String,
    lastName: String,
    email: String,
    password: String,
    picture: String
}
);
module.exports = mongoose.model("user", UserSchema);