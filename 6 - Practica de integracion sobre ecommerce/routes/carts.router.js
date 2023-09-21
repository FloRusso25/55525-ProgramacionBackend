import {Router} from 'express'
import Cart from '../dao/mongoDbManager/carts.mongoDb.js'
import Product from '../dao/mongoDbManager/product.mongoDb.js'

const router = Router()


let cart = new Cart()
let product = new Product()

router.get('/:cid', async (req,res) => {
    const getCart = await cart.getCartById(Number(req.params.cid))

    getCart.value = (getCart.status == 200) ? getCart.value.products : getCart.value
    
    res.status(getCart.status).send(getCart.value)
})

router.post('/', async (req, res) => {
    const newCart = await cart.createNewCart() 

    res.status(newCart.status).send(newCart.value)
})

router.post('/:cid/product/:pid', async (req,res) => {
    let validProduct = await product.getProductById(Number(req.params.pid))
    
    if (validProduct.status == 200) {
        const updateCart = await cart.updateCart(Number(req.params.cid), Number(req.params.pid))
        res.status(updateCart.status).send(updateCart.value)
    }
    else {
        res.status(validProduct.status).send(validProduct.value)
    }
    
})

export default router