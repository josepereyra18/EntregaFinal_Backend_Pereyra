import productsModel from '../models/products.model.js'

        export default class Products{
        constructor(){

        }
        getProducts = async () => {
                let productos = await productsModel.find();
                return productos;
        }


        getProductById = async (productId) => {
                let producto = await productsModel.findById(productId);
                return producto;
        }


        createProduct = async (product) => {
                let result = await productsModel.create(product);
                return result;
        }


        updateProduct = async (productId, product) => {
                let result = productsModel.updateOne({_id: productId}, product)
                return result;
        }

        deleteProduct = async (productId) => {
                let result = productsModel.deleteOne({_id: productId});
                return result;
        }

}