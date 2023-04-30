import express from 'express';
import { createproduct, deleteProduct, getProduct, productInfo, updateProduct } from '../controllers/productController.js';
import { authorized, findRole } from '../middlewares/auth.js';
import upload from '../middlewares/fileImage.js';
const router = express.Router()

router.post('/create', upload.single('photo'),findRole,authorized("admin"),createproduct)//done
router.get('/products',getProduct)//done
router.post('/updateProduct/:id', findRole, authorized("admin"), updateProduct)//done
router.delete('/deleteProduct/:id', findRole, authorized("admin"), deleteProduct)//done
router.get('/productInfo/:id', productInfo)//done
export default router