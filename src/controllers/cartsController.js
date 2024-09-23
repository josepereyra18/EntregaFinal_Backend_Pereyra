import ticketDto from "../dao/DTOs/ticket.dto.js";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import {cartsService,productsService,ticketsService, usersService} from "../service/index.js";



export const getCarts =async (req,res) =>{
    try{
        let carts = await cartsService.getCarts()
        res.send({result: "success", payload: carts});
    } catch (error){
        console.log(error);
    }
}


export const getCartbyId =async (req, res) =>{
    const cartId = req.params.cid;
    try {
        const cart = await cartsService.getCartbyId(cartId);
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }
        res.send({result: "success", payload: cart});
    } catch (error) {
        console.log(error);
    }
}


export const createCart = async (req, res) =>{
    const newCart = await cartsService.createCart();
    res.send({result: "success", message: "Carrito creado", payload: newCart});
}

export const addProductToCart = async (req,res) =>{
    let { id } = req.params;
    let { pid } = req.params;
    try{

        let producto = await productsService.findOne({_id:pid});
        let carrito = await cartsService.getOneCart(id);

        if (!carrito || !producto){
            return res.status(404).send({ message: "Datos inexistentes" });
        }

        if ( await cartsService.findProductInCart(id, pid)){
            carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity++;
        }else{
            carrito.products.push({product:pid , quantity: 1});
        }

        let prodAgregado = await cartsService.updateCart(id, carrito);
        res.send({result: "success", payload: prodAgregado});
    }catch(error){
        console.log(error);
        res.send({message: "No se pudo agregar el producto al carrito"});
    }
}


export const updateCart = async (req, res)=>{
    let arregloProductos = req.body;
    let { cid } = req.params;

    try{
        let cart = await cartsService.getCartbyId(cid); 
        if (!cart){
            return res.status(404).send({message: "El carrito no existe"});
        }

        cart.products = arregloProductos;

        let cartUpdated = await cartsService.updateCart(cid, cart); 
        res.send({result: "success", payload: cartUpdated});
    }catch(error){
        console.log(error);
        res.send({message: "Existe un error en los datos brindados. No se pudo modificar el carrito"});
    }    
}

export const updateProductFromCart = async (req, res) =>{
    let { cid } = req.params;
    let { pid } = req.params;
    let { quantity } = req.body;

    try {
        let cart = await cartsService.getCartbyId(cid); 
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }
        let producto = cart.products.find(prod => prod.product.toString() === pid);
        if (producto === undefined) {
            return res.status(404).send({ message: "Producto no encontrado en el carrito" });
        }
        producto.quantity = quantity;

        let cartUpdated = await cartsService.updateCart(cid, cart); 

        res.send({ result: "success", payload: cartUpdated });
    } catch (error) {
        console.log(error);
        res.send({ message: "No se pudo actualizar la cantidad del producto en el carrito" });
    }
}


export const deleteProductFromCart = async (req, res) =>{
    let { id } = req.params;
    let { pid } = req.params;
    let prodAgregado;
    try{
        let carrito = await cartsService.getOneCart(id);
        let producto = await productsService.findOne({_id: pid});
        if (!carrito || !producto){
            return res.status(404).send({ message: "Datos inexistentes" });
        }
        if (carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity > 1){
            carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity--;
            prodAgregado = await cartsService.updateCart(id, carrito);
        }else{
            prodAgregado = await cartsService.delateproductfromCart(id, pid);
        }
        
        res.send({result: "success", payload: prodAgregado});
    }catch(error){
        console.log(error);
        res.send({message: "No se pudo eliminar el producto del carrito"});
    }
}


export const deleteAllProductsFromCart = async (req, res) =>{
    let { id } = req.params;
    try{
        let carrito = await cartsService.getOneCart(id);
        if (!carrito){
            return res.status(404).send({ message: "Carrito no encontrado" });
        }
        carrito.products = [];
        let prodEliminado = await cartsService.updateCart(id, carrito);

        res.send({result: "success", payload: prodEliminado});
    }catch(error){
        console.log(error);
        res.send({message: "No se pudo eliminar el producto del carrito"});
    }
}



export const checkoutCart = async (req, res) =>{
    let { cid } = req.params;
    try{
        
        let carrito = await cartsService.getOneCart(cid);
        if (!carrito){
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        let code = uuidv4();
        let total = await processProducts(carrito)
        let user = await usersService.findUserById(carrito.userId);
        let ticketdto = new ticketDto(code, total, user.email);
        let ticket = await ticketsService.createTicket(ticketdto);
        ticket.userId = carrito.userId;
        await ticketsService.updateTicket(ticket._id, ticket);
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port:587, 
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASSWORD
            }
        })

        let result = await transport.sendMail({
            from: process.env.MAIL,
            to: ticket.purcherser, 
            subject: `Compra realizada con exito #${code}`,
            html: `
            <div>
                <h1> ${user.first_name}, ¡Recibimos tu compra!</h1>
                <h2>Nro de Orden #${code}</h2>
                <h3>Fecha: ${ticket.purchaseDate}</h3>
                <h4>Productos:</h4>
                <ul>
                    ${total.map(prod => `<li>${prod.producto.title} - x${prod.quantity}</li>`).join("")}
                </ul>
                <h3>Total: $${ticket.amount}</h3>
                <h4>Gracias por elegirnos!</h4>
            </div>
            `
        })
        res.send({result: "success", payload: ticket});


    }catch(error){
        console.log(error);
        res.send({message: "error al generar la compra"});
    }
}

async function processProducts(carrito) {
    try{
        let productos = [];
        carrito.products.forEach(async prod => {
        let producto = await productsService.getProductById(prod.product._id);
        productos.push({producto, quantity: prod.quantity});
    })
    return productos;
    }catch(error){
        console.log(error);
    }
    
}


export const delateProductsFromCart= async(prodId)=>{
    try{
        let carts = await cartsService.delateProductsFromCart(prodId);
        console.log(carts)
        let prod = await productsService.getProductById(prodId);
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port:587, 
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASSWORD
            }
        })
        for (let i = 0; i < carts.length; i++){
            let result = await transport.sendMail({
                from: process.env.MAIL,
                to: carts[i].userId.email, 
                subject: `Modificacion en carrito`,
                html: `
                <div>
                    <h1> Hola ${carts[i].userId.first_name}, uno de los productos que tenias en tu carrito fue eliminado</h1>
                    <h2>Producto eliminado: ${prodId}</h2>
                    <h3>${prod.title}</h3>
                    <h4>${prod.price}</h4>
                    <h5>Te pedimos dusculpas por las molestas</h3>
                    <h5> puedes revisar nuestras ofertas en nuestra pagina</h5>
                    <a> aqui </a>
                </div>
                `
            })
        }
    }catch(error){
        console.log(error);
    }
    

}