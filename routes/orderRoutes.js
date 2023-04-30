import express from 'express';

const router = express.Router()
import {deleteAllOrder, deleteOrder, getAllOrder, getOrder, newOrder} from "../controllers/orderController.js"//done
import { authorized, findRole } from '../middlewares/auth.js';
import { verify} from '../controllers/userController.js';
router.post('/newOrder',verify,newOrder)//done
router.get('/getOrder',verify,getOrder )//done
router.get('/getAllOrder',findRole,authorized("admin"),getAllOrder)//done
router.delete('/removeOrder/:id',verify,deleteOrder)//done
router.delete('/deleteAllOrder', verify,deleteAllOrder)
// router.delete('/deleteAllOrder/:id', findRole,authorized("admin"),deleteAllOrder)

export default router