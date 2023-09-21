import fs from 'fs'

export default class Cart {
    constructor(fileName) {
        this.fileName = fileName
        this.filePath = process.cwd()
    }

    async saveContentInFile(fileName, content) {
        try {
            await fs.promises.writeFile(`${this.filePath}/${fileName}`, JSON.stringify(content))
        } catch(error) {
            console.log(`ERROR saving in file. Msg: ${error}`)
        }
    }

    async getAllCarts() {
        try {
            const carts = await fs.promises.readFile(`${this.filePath}/${this.fileName}`, 'utf-8')
            return carts ? JSON.parse(carts) : []

        } catch (error) {
            console.log (`ERROR getting all carts. Msg: ${error}`)
            return {error: `Cannot get all carts. Msg: ${error}`}
        }
    }

    //Creates new cart with the proper id and an empty array of products and adds it to cart file
    async createNewCart() {
        try {
            let newCart = {
                id: 0,
                products: []
            }
            let carts = await this.getAllCarts()
            newCart.id = (carts.length ? Math.max(...carts.map(item => item.id)) + 1 : 1)
            carts.push(newCart)
            await this.saveContentInFile(this.fileName, carts)

            return {status: 200, value: newCart}

        } catch (error) {
            console.log (`ERROR creating cart. Msg: ${error}`)
            return {status: 400, value: `ERROR creating cart. Msg: ${error}`}
        } 


    }

    //Gets a cart by a particular id
    async getCartById(id) {
        try{
            const carts = await this.getAllCarts()
            console.log(`CARTSCLASS: ${JSON.stringify(carts)}`)
            const cartById = carts.find(cart=> cart.id == id)

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
            let carts = (await this.getAllCarts()).filter(item => item.id != cartId)
            carts.push(oldCart)

            await this.saveContentInFile(this.fileName, carts)

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