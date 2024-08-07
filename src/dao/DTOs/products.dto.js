export default class prodDTO {
    constructor(title, description, price, code, stock, category) { 
        this.title = title;
        this.description = description;
        this.price = price;
        this.code = code;
        this.stock = stock;
        this.status = true;
        this.category = category.toUpperCase();
    }
}
