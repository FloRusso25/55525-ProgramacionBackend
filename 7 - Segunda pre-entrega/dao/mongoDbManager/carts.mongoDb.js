import cartModel from "../models/cart.model.js"
import mongoose from 'mongoose'

export default class Cart {
    constructor() {
    }

    async getAllCarts() {
        try {
            return {status: 200, value: await cartModel.find().lean().populate('products.product')}

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
            let cartById = await cartModel.findById(new mongoose.Types.ObjectId(id)).lean().populate('products.product')
            console.log(`CART BY ID: ${JSON.stringify(cartById)}`)
            return cartById ? {status: 200, value: cartById} : {status: 404, value: `Cart with ID ${id} not found`} 
        }
        catch (error) {
            console.log (`ERROR getting cart with id ${id}. Msg: ${error}`)
            return {status: 400, value: `ERROR getting cart with id ${id}. Msg: ${error}`}
            
        }
    }

    //Adds a product into the cart
    addProductToCart(productId, cart, quantity = 1) {
        
        try{
            console.log(`En add prod CART ${JSON.stringify(cart)}`)
            let item = cart.products.find(prod => prod.product._id == productId)
            console.log(`En add prod ${JSON.stringify(item)}`)
            if (!item) {
                cart.products.push({product: productId, quantity: quantity})
            }
            else {
                cart.products = cart.products.map(key => {
                    if (key.product._id == productId) {
                        key.quantity += quantity
                    } 
                    return key
                })
            }
            return cart
            
        }catch (error) {
            console.log (`ERROR adding product ${productId}. Msg: ${error}`)
        }        
    }

    //Deletes a product from the cart
    deleteProductFromCart(productId, cart) {
        try{
            let item = cart.products.find(prod => prod.product._id == productId)
            if (item) {
                cart.products = cart.products.filter(prod => prod.product._id != productId)
            }
            return cart
            
        }catch (error) {
            console.log (`ERROR deleting product ${productId}. Msg: ${error}`)
        }        
    }

    //Updates a cart with a specific id and a specific product 
    async updateCart(cartId, productId, prodQuantity = 1, deleteProd = false) {

        try {
            let oldCart = await this.getCartById(cartId)
            console.log(`UPDATE CART OLD CART: ${JSON.stringify(oldCart)}`)
            if (oldCart.status == 404) {
                return oldCart
            }

            if (deleteProd == false) {
                if (typeof productId == 'object') {
                    productId.forEach(prdId => {
                        console.log(`Hace el add prod aca en el if`)
                        oldCart = this.addProductToCart(prdId, oldCart.value)
                    });
                }
                else{
                    console.log(`Hace el add prod en el else`)
                    oldCart = this.addProductToCart(productId, oldCart.value, prodQuantity)
                }
            }
            else {
                oldCart = this.deleteProductFromCart(productId, oldCart.value)
            }


            let newCart = await cartModel.findOneAndUpdate({_id: `${oldCart._id}`}, oldCart, {new: true}).lean().populate('products.product')

            return {status: 200, value: newCart}
        }
        catch (error) {
            console.log (`ERROR updating cart ${cartId}. Msg: ${error}`)
            return {status: 400, value: oldCart}
        }
    }

    async deleteCart(cartId) {
        try {
            let cartDeleted = await cartModel.findOneAndDelete({_id: `${cartId}`}).lean()
            if (cartDeleted != null) {
                return {status: 200, value: `Cart ${cartId} deleted. ${cartDeleted}`}
            }
            else {
                return {status: 404, value: `Cart with id ${cartId} not found`}
            }
        }
        catch (error) {
            console.log (`ERROR deleting cart ${cartId}. Msg: ${error}`)
            return {status: 400, error: `Cannot delete cart with id ${cartId}. ${error}`}
        }
    }

    async emptyCart(cartId) {
        try {
            let cart = (await this.getCartById(cartId)).value

            cart.products = []

            let emptyCart = await cartModel.findOneAndUpdate({_id: `${cart._id}`}, cart, {new: true})

            return {status: 200, value: emptyCart}
        }
        catch (error) {
            console.log (`ERROR emptying cart ${cartId}. Msg: ${error}`)
            return {status: 400, error: `Cannot empty cart with id ${cartId}. ${error}`}
        }
    }
}