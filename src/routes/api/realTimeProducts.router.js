import express from 'express';
const router = express.Router();
import { isAdmin } from '../../middlewares/isAdmin.js';

router.get('/', isAdmin ,async(req, res) => {
    res.render('realTimeProducts', {user: req.user});
})
export default router;