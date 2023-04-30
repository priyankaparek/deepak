import  xlsx from 'xlsx';
import Order from '../models/Order.js'
import path from 'path'
import {sendEmail} from '../middlewares/sendEmail.js'


export const allCartItem = async (req, res, next)=>{
    const user = req.user
    const order = await Order.find({user})
    if(!order){
        return res.status(206).json({message:"user not found"})

    }else{
       
  req.userCartItem =order;
}
next()
}

 export const makeExcel = async(req,res, next) => {
  const order = req.userCartItem
  const user = req.user
  const {name, email,phoneNumber, country, state, company } = user

const columnName = [
   "S.No", "Person","Email","Phone_Number","Address","Product","Price","Quantity","Price With Quantity","Final Price"
 ]
   
const fileName = name
const filePath = `./Excel/${email}.xlsx`
const cartItems_excelList = order.map((el) => {
return [el.orderItem[0].name, el.orderItem[0].price, el.orderItem[0].quantity,(el.orderItem[0].price * el.orderItem[0].quantity)]
})
const finalPrice =    order.reduce((total, item) => total + item.itemPrice, 0)
 const excelsheetofcartItems =  cartItems_excelList.map((el,i) => {
      return [i+1, name , email, phoneNumber, (country + " "+ state + " " + company), ...el, finalPrice]
 
   
})

const excelFile = xlsx.utils.book_new();
const excelData = [
    columnName,
    ...excelsheetofcartItems
];
const excelSheet = xlsx.utils.aoa_to_sheet(excelData)
xlsx.utils.book_append_sheet(excelFile, excelSheet, fileName)
xlsx.writeFile(excelFile,path.resolve(filePath))
await sendEmail({ email: "priyankapareek8740@gmail.com", subject: "User Order", message:`${fileName} Cart Items`, attachments:{fileName:fileName , path: `${filePath}`} });
return res.status(200).json({success:true})
}
