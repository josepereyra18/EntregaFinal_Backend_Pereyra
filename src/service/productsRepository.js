export default class ProductsRepository {
    constructor(dao){
        this.dao = dao;
    }

    getProducts = async () => {
        let result = await this.dao.getProducts();
        return result;
    }

    getProductById = async (id) => {
        let result = await this.dao.getProductById(id);
        return result;
    }

    createProduct = async (product) => {
        let result = await this.dao.createProduct(product);
        return result;
    }

    updateProduct = async (id, product) => {
        let result = await this.dao.updateProduct(id, product);
        return result;
    }

    deleteProduct = async (id) => {
        let result = await this.dao.deleteProduct(id);
        return result;
    }

}