import cartsModel from "../models/cart.model.js";
export default class Carts {
        constructor() {}

        createCart = async () => {
                let result = await cartsModel.create({});
                return result;
        };

        getCarts = async () => {
                let result = await cartsModel.find();
                return result;
        };

        getCartbyId = async (cartId) => {
                let result = await cartsModel.find({ _id: cartId });
                console.log(result);
        return result;
        };

        getOneCart = async (cartId) => {
                let result = await cartsModel.findOne({ _id: cartId });
                return result;
        };

        findProductInCart = async (id, pid) => {
                let result = await cartsModel.findOne({
                        _id: id,
                products: { $elemMatch: { product: pid } },
                });
                return result;
        };

        updateCart = async (cartId, cart) => {
                let result = await cartsModel.updateOne({ _id: cartId }, cart);
                return result;
        };

        delateproductfromCart = async (cartId, productId) => {
                let result = await cartsModel.updateOne(
                        { _id: cartId },
                        { $pull: { products: { product: productId } } }
                );
                return result;
        };
}
