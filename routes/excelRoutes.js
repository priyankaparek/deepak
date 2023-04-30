import express from 'express'
import {findRole } from '../middlewares/auth.js';
import { allCartItem, makeExcel } from '../controllers/excelController.js'

const router = express.Router()

router.get("/excel",findRole,allCartItem,makeExcel)

export default router