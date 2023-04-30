import UserModel from "../models/Users.js";
import jwt from 'jsonwebtoken'
const JWT_SECRET_KEY = "MYkEY";

export const findRole = async(req,res,next) =>{
    try {
        const cookie = req.headers.cookie
        if (!cookie) {
            return res.status(206).json({ status: false, message: "cookie not found" })
        }
     
          const  token = cookie.split("=")[1]
        jwt.verify(String(token), JWT_SECRET_KEY, async(error, user) => {
            if (error) {
                return res.status(206).json({ status: false, message: "token not found" })
            }
            else {
                const userId = user.id
                if(!userId){
                    return res.status(206).json({message:"Getting User Failed"})
                } else {
                   
                    req.user = await UserModel.findById(userId);
                }
                next()
            }
        })
    } catch (error) {
        res.send({ status: false, message:error.message })
    }
}

export const authorized = (...roles) =>{
    return (req, res, next)=>{
        if (!roles.includes(req.user.role)){
            return res.status(200).json(`role: ${req.user.role} is not allowed  to access this resource`)
        }
        next()
    }
}
