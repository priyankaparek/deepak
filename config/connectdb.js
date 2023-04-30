import mongoose from 'mongoose'
 const connection = async() => {
    try{
      await  mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
        .then((data) => {
         console.log("connected");
        }).catch((err) => {
          return false
        })
    }catch(err){
        console.log(err);
    }
}
export default connection



