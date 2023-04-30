import multer from "multer"
const imageConfig = multer.diskStorage({
    destination: (req, file, callback)=>{
      
        callback(null,"./upload")
    },
    filename:(req, file, callback)=>{
        callback(null,`image-${Date.now()}.${file.originalname}`)
    }
})

const isImage = (req, file, callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true) 
    }else{
callback(null, Error("warning"))
    }
}
const upload = multer({
    storage: imageConfig, 
    fileFilter: isImage

})


export default upload