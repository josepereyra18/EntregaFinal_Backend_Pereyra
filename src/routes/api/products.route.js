import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../../controllers/productsController.js';
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = Router();

router.get('/products', getProducts);  

router.get('/products/:id', getProductById); 

router.post('/products', createProduct);  

router.put('/products/:id',updateProduct); 

router.delete('/delate/products/:id', deleteProduct);



export default router;