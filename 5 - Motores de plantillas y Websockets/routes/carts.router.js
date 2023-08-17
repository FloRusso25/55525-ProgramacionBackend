import {Router} from 'express'
import Cart from '../class/carts.js'
import Product from '../class/product.js'

const router = Router()

let filePathCart = `./files/carts.json`
let filePathProduct = `./files/products.json`
let cart = new Cart(`${filePathCart}`)
let product = new Product(`${filePathProduct}`)

router.get('/:cid', async (req,res) => {
    const getCart = await cart.getCartById(Number(req.params.cid))
    console.log(`CARTRES: ${JSON.stringify(getCart)}`)
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