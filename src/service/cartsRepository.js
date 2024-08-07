export default class cartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    createCart = async () => {
        let result = await this.dao.createCart();
        return result;
    }

    getCarts = async () => {
        let result = await this.dao.getCarts();
        return result;
    }

    getCartbyId = async (cartId) => {
        let result = await this.dao.getCartbyId(cartId);
        return result;
    }

    getOneCart = async (cartId) => {
        let result = await this.dao.getOneCart(cartId)
        return result;
    }

    findProductInCart = async (id, pid) => {
        let result = await this.dao.findProductInCart(id, pid);
        return result;
    }

    updateCart = async (cartId, cart) => {
        let result = await this.dao.updateCart(cartId, cart);
        return result;
    }

    delateproductfromCart = async (cartId, productId) => {
        let result = await this.dao.delateproductfromCart(cartId, productId);
        return result;
    }
}