import mongoose from "mongoose";



const ProductSchema = new mongoose.Schema({
    name: { type: String, required: ['please enter product name'] },
    decription: { type: String, required: ['please enter product description'] },
    price: { type: Number, required: ['please enter product price'], maxLength: [8, "message"] },
    image: {type: String, required: true},
    user: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
    status: {type:Boolean, default:false},
    quantity: {type:Number, default:1},
    category: { type: String, required: ['please enter product name'] },
    createdAt: { type: Date, default: Date.now() },
})


const Cart = mongoose.model("Product", ProductSchema)
export default Cart