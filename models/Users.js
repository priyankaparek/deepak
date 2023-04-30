import mongoose from "mongoose";
import crypto  from "crypto"



// Defining Schema
const userSchema = new mongoose.Schema({   
name: { type: String, required: true},
email: { type: String, required: true},
image: { type: String, required: true},
password: { type: String, required: true},
phoneNumber: {type: Number, required:true },
role: {type: String , default: "customer" },
country: {type: String , required: true },
state: {type: String , required: true },
company: {type: String , required: true },
otp: {type: Number}
})

// Model

    
    const UserModel = mongoose.model("User", userSchema)
export default UserModel;