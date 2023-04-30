import  mongoose from 'mongoose';
const Order = new mongoose.Schema({
    orderItem : [
        {
            name: {type: String, required: true},
            price: {type: Number, required: true},
            quantity: {type: Number, default: 1},
            image: {type: String},
            product: {
                type: mongoose.Schema.ObjectId, 
                ref:"Products",
                required: true
            }

        }
    ],
    user: {
        type: mongoose.Schema.ObjectId, 
                ref: "Users",
                required: true

    },
    itemPrice:{
        type: Number,
        default: 0,
        required: true
    },
   
   
    createdAt:{ 
        type: Date,
        default: Date.now

    }
})


const OrderSchema = mongoose.model("Order", Order)
export default OrderSchema