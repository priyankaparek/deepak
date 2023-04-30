import jwtToken from 'jsonwebtoken';
// const JWT_SECRET_KEY = "MYkEY";

const token = async(userid, statuscode,res) =>{
  
  const token =  jwtToken.sign({ id: userid }, process.env.jwt_secret, {
        expiresIn: "7d",
      });
     const option =  {
        path: '/',
        expires:  new Date(Date.now() + 7 * 24 * 3600000),
        httpOnly: true,
        sameSite: 'lax',
      }
      return res.status(statuscode).cookie(String(userid), token,option).json({success:true, message:"Login Successfully"})
}

export default token;
