import Product from '../models/Product.js'


// CREATE PRODUCT

export const  createproduct = async(req, res)=>{
  req.body.user = req.user.id
  const {filename} = req.file 
  const image = `${process.env.IMAGE_URL}/${filename}`
  const {name, decription, price, category} = req.body;
    const product  = new Product({
      name: name,
      decription: decription,
      price: price,
      category: category,
      image: image, 
      user: req.user.id
    })
    await product.save()
    return  res.status(200).json({success: true, message: "Product added successfully"})
}

// GET PRODUCT
export const  getProduct = async(req, res)=>{
try{
const product = await Product.find().populate({path:"order",select:"itemPrice",  strictPopulate: false }).exec()
if(!product){
  return  res.status(206).json({message:" product not found"})
}else{
  return  res.status(200).json(product)
}
}catch(error){
  return  res.status(206).json({message:error.message})
}
}

// UPATE PRODUCT
export const updateProduct = async(req, res)=>{
  try{
    const {name, decription, price, category } = req.body
    const {id} = req.params
let product = await Product.findById(id)
if(!product){
  return  res.status(206).json({message:" product not found"})
}else{
  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  return  res.status(200).json({success: true, message: "Product updated successfully"})
}
  }catch(error){
    return  res.status(500).json({message:error.message}) 
  }
}

  // DELETE PRODUCT
export const deleteProduct = async(req, res)=>{
  try{
const {id} = req.params
let product = await Product.findById(id)
if(!product){
  return  res.status(206).json({message:" product not found"})
}
else{
  await product.delete()
  return  res.status(206).json({message: " Product Removed Successfully"})
}
  }catch(error){
    return  res.status(500).json({message:error.message}) 
  }

}

export const productInfo = async (req, res) =>{
  try{
    const {id} = req.params
    let product = await Product.findById(id)
    if(!product){
      return  res.status(206).json({message:" product not found"})
    }
    else{
    
      return  res.status(200).json(product)
    }
  }catch(error){
    return  res.status(500).json({message:error.message}) 
  }
} 