const mongoose =require("mongoose");
const AdminSchema =new mongoose.Schema({
    name : String,
    lastName: String,
    email : String,
    password: String
    }
);
module.exports= mongoose.model("admin",AdminSchema);