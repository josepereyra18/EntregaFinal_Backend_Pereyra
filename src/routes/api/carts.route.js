import { Router } from "express";
import { getCarts,getCartbyId,createCart,addProductToCart,updateCart,updateProductFromCart,deleteProductFromCart,deleteAllProductsFromCart, checkoutCart } from "../../controllers/cartsController.js";
import { isUser } from "../../middlewares/isUser.js";
const router = Router();

router.get('/cart', getCarts);  

router.get('/cart/:cid',getCartbyId);  

router.post('/cart', createCart)  

router.post('/cart/:id/product/:pid', isUser ,addProductToCart) 

router.put ('/cart/:cid',updateCart )  

router.put('/cart/:id/product/:pid',updateProductFromCart); 

router.delete('/cart/:id/product/:pid', deleteProductFromCart) 

router.delete('/cart/:cid', deleteAllProductsFromCart ) 

router.post('/cart/:cid/purchase', checkoutCart)


export default router;