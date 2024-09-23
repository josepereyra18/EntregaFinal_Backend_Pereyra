import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();
import productsRouter from './routes/api/products.route.js'
import cartRouter from './routes//api/carts.route.js'
import realTimeProducts from './routes/api/realTimeProducts.router.js'
import mongoose from 'mongoose';
import productsModel from './dao/mongo/models/products.model.js'
import chatModel from './dao/mongo/models/chat.model.js';
import cartModel from './dao/mongo/models/cart.model.js';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import sessionRouter from './routes/api/session.router.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';  
import passport from 'passport';
import initializepassport from './middlewares/passport.config.js';
import sharedSession from 'express-socket.io-session';
import productsDto from './dao/DTOs/products.dto.js';
import ressCon from './routes/api/reesCont.js'
import userRoute from './routes/api/users.route.js'
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUiExpress from 'swagger-ui-express';

const app = express();

const PORT = process.env.PORT_LIVE;
const httpServer = app.listen(PORT, console.log(`Server is running on port ${PORT}`));
const socketServer = new Server(httpServer);
const sessionMiddleware = session(
    {secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL})
})


app.use(sessionMiddleware)


socketServer.use(sharedSession(sessionMiddleware, {
    autoSave: true
}));

mongoose.connect(process.env.MONGO_URL).then(
    () => {console.log('Conectado a la base de datos')}).catch(error => console.log("error en la conexion ", error))

app.engine('handlebars',handlebars.engine({
    helpers: {
        isTrue: function(value, options) {
            return value ? options.fn(this) : options.inverse(this);
        },
        encodeURIComponent: function (str) {
            return encodeURIComponent(str);
        }
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
}));


initializepassport();
app.use(passport.initialize());
app.use(passport.session());

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación',
            description: 'API para el manejo de productos y  carritos',

        },

    },
    apis :[`src/docs/**/*.yaml`],
}

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs));


app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', productsRouter);
app.use('/api', cartRouter);
app.use("/realTimeProducts", realTimeProducts )
app.use('/api/session', sessionRouter);
app.use('/reestablecimientoCont',ressCon)
app.use('/api/users', userRoute)
app.use('/', viewsRouter);

let historialMensajes = await chatModel.find();
let usuarios = []
socketServer.on('connection', async socket => {
    const session = socket.handshake.session;


    console.log('Un cliente se ha conectado');

    // soket RealTimeProducts

    async function productosActualizados (){
    const productosActualizados = await productsModel.find() ;
    socketServer.emit('Lista-Modificada', productosActualizados);
    }

    const productos = await productsModel.find();
    socket.emit('Lista-Modificada', productos);

    // Cuando se elimina un producto
    socket.on ('eliminarProd', async (id) => {
        await cartModel.updateMany({ products: {_id : id}}, { $pull: { products: {_id : id} } });
        await productsModel.deleteOne({_id: id})
        productosActualizados();
    })
    // Cuando se agrega un producto
    socket.on('agregarProd', async (product) => {
        let productdto= new productsDto(product.title, product.description, product.price, product.code, product.stock, product.category);
        await productsModel.create(productdto);
        productosActualizados();
    })
  // Cuando se modifica un producto
    socket.on('modificarProd', async (product, id) => {
        await productsModel.updateOne({_id: id}, product)
        productosActualizados();
    });


    //socket agregar productos al carrito 
    let cart= []
    if (session && session.user && session.user.cartId) {
        let carrito
        const cartId = session.user.cartId;
        if (session.cart === undefined){
            carrito = await cartModel.findOne({_id: cartId});
            
        }else{
            await cartModel.updateOne({_id: cartId}, {products: session.cart});
            carrito = await cartModel.findOne({_id: cartId});
        }
        socket.emit('reestablecerCart', carrito.products);
        socket.emit('cartId', cartId);
    }else{
        socket.emit('cartNoUser', cart);
    }


    socket.on ('agregarProducto', async (productId, cartId) => {
        let producto = await productsModel.findOne({_id:productId});
        if (cartId === 0){
            producto.quantity = 1;
            let prod = cart.find(prod => prod.product.toString() === producto._id.toString())
            if (prod === undefined){
                cart.push({product:productId , quantity: 1});
            }else{
                prod.quantity++;
            }
            session.cart = cart;
        }else{
                let carrito = await cartModel.findOne({_id:cartId});
                if (await cartModel.findOne({_id: cartId , products: {$elemMatch: {product:productId}}})){
                    carrito.products.find(prod => prod.product.toString() === producto._id.toString()).quantity++;
                }else{
                    carrito.products.push({product:productId , quantity: 1});
                }
                await cartModel.updateOne({_id:cartId}, carrito);
            }
        socket.emit('productoAgregado', producto);
        socket.emit('cartNoUser', cart);
    })
    
})

