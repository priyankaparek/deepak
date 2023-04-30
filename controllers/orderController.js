import Order from '../models/Order.js'
import Product from '../models/Product.js'


export const newOrder = async (req, res, next)=>{
  const {orderItem,  itemPrice }= req.body
  const user = req.user

  
   const updateOrder = await Order.findOne({'orderItem.product':orderItem.product, user:user})
  if(updateOrder){
const data = [...updateOrder.orderItem]
  const quantity = data[0].quantity
  updateOrder.orderItem[0].quantity = quantity + orderItem.quantity
  updateOrder.itemPrice = parseInt(updateOrder.itemPrice + itemPrice)
   await updateOrder.save()
}else{
const order = await Order.create({
       orderItem,  itemPrice,  user   
   })
   await order.save()
  }
  return  res.status(200).json({success : true , message: "Product added successfully"})
}

 


 export const getOrder = async (req, res, next)=>{
    const user = req.user

    const order = await Order.find({user})
    if(!order){
        return res.status(206).json({message:"user not found"})
    }
    else{
    
     
        return  res.status(200).json(order)
    }
 }

 export const getAllOrder = async (req, res)=>{
    const order = await Order.find()
    if(!order) {
        return res.status(206).json({message:"order not found"})
    }else{
        let totalAmount ;
        totalAmount =   order.reduce((total, item) => total + item.itemPrice, 0)
    
        return  res.status(200).json({order, totalAmount})
    }
 }

 export const deleteOrder = async (req, res)=>{
    const {id} = req.params
    let product = await Order.findOne({'orderItem.product':id})

    if(!product){
      return  res.status(206).json({success : false,message:" product not found"})
    }
    else{
    
      const productId = product.orderItem[0].product
      removeStatus(productId)
      await product.delete()
      return  res.status(200).json({success : true , message: "product deleted successfully"})
    }
 }


 const removeStatus = async(productId) => {
  const product = await Product.findById(productId)
  if(!product){
    return  res.status(206).json({message:" product not found"})
  }
 
  product.status = false;

 await product.save()
 }

 export const deleteAllOrder = async (req, res)=>{
  const userId = req.user
    allStatusChange(userId)
    let product = await Order.deleteMany({user:userId})
    if(!product){
      return  res.status(206).json({message:" product not found"})
    }
    else{
      return  res.status(200).json({message: "we got your request, Our Team will contact you soon on your registered email"}) 
    }
 }
 const allStatusChange = async(userId) => {
  const order = await Order.find({user:userId})
  if(!order){
    return  res.status(206).json({message:" product not found"})
  }
  else{
  const data = order.map((el) => el.orderItem)
let ids = [];
const items = [...data]
items.map((el) => {
    ids.push(el[0].product)
  })
  const product = await Product.find({"_id":{"$in": ids}})
  if(!product){
    return  res.status(206).json({message:" product not found"})
  }else{
   product.map(async(ab) => {
     ab.status = false
     await ab.save()
    
    })


  }
  }
 } 