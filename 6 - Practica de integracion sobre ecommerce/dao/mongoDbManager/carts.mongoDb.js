import cartModel from "../models/cart.model.js"

export default class Cart {
    constructor() {
    }

    async getAllCarts() {
        try {
            return {status: 200, value: await cartModel.find()}

        } catch (error) {
            console.log (`ERROR getting all carts. Msg: ${error}`)
            return {status: 400, error: `Cannot get all carts. Msg: ${error}`}
        }
    }

    //Creates new cart with the proper id and an empty array of products and adds it to cart file
    async createNewCart() {

        try {
            const newCart = await cartModel.create({});
            
            return {status: 200, value: newCart};
        } catch (error) {
            console.log (`ERROR creating cart. Msg: ${error}`)
            return {status: 400, value: `ERROR creating cart. Msg: ${error}`}
        }
    }

    //Gets a cart by a particular id
    async getCartById(id) {

        try{
            let cartById = await cartModel.findById(id)

            return cartById ? {status: 200, value: cartById} : {status: 404, value: `Cart with ID ${id} not found`} 
        }
        catch (error) {
            console.log (`ERROR getting cart with id ${id}. Msg: ${error}`)
            return {status: 400, value: `ERROR getting cart with id ${id}. Msg: ${error}`}
            
        }
    }

    //Updates a cart with a specific id and a specific product 
    async updateCart(cartId, productId) {

        try {
            let oldCart = await this.getCartById(cartId)
            if (oldCart.status == 404) {
                return oldCart
            }
            oldCart = this.addProductToCart(productId, oldCart.value).value
            let newCart = await cartModel.findOneAndUpdate({_id: `${oldCart._id}`}, oldCart, {new: true})

            return {status: 200, value: oldCart}
        }
        catch (error) {
            console.log (`ERROR updating cart ${cartId}. Msg: ${error}`)
            return {status: 400, value: oldCart}
        }

    }
   
    //Adds a product into the cart
    addProductToCart(productId, cart) {
        
        try{
            let item = cart.products.find(prod => prod.product == productId)
            if (!item) {
                cart.products.push({product: productId, quantity: 1})
            }
            else {
                cart.products = cart.products.map(key => {if (key.product == productId) {key.quantity += 1} return key})
            }
            
            return {status: 200, value: cart}
            
        }catch (error) {
            console.log (`ERROR adding product ${productId}. Msg: ${error}`)
        }        
    }
}