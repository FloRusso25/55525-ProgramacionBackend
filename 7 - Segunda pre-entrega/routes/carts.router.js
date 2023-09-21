import {Router} from 'express'
import Cart from '../dao/mongoDbManager/carts.mongoDb.js'
import Product from '../dao/mongoDbManager/product.mongoDb.js'

const router = Router()


let cart = new Cart()
let product = new Product()

router.get('/:cid', async (req,res) => {
    const getCart = await cart.getCartById(req.params.cid)

    getCart.value = (getCart.status == 200) ? getCart.value.products : getCart.value
    
    res.status(getCart.status).send(getCart.value)
})

router.post('/', async (req, res) => {
    const newCart = await cart.createNewCart() 

    res.status(newCart.status).send(newCart.value)
})

router.post('/:cid/products/:pid', async (req,res) => {
    let validProduct = await product.getProductById(req.params.pid)

    console.log(`Get prod by id in post cart prod: ${JSON.stringify(validProduct)}`)
    
    if (validProduct.status == 200) {
        const updateCart = await cart.updateCart(req.params.cid, req.params.pid)
        res.status(updateCart.status).send(updateCart.value)
    }
    else {
        res.status(validProduct.status).send(validProduct.value)
    }
    
})

router.put('/:cid', async (req, res) => {

    const cartUpdated = await cart.updateCart(req.params.cid, req.body.productsIds)
    if (cartUpdated.status == 200) {
        res.send(cartUpdated.value)
    }
    else{
        res.send(cartUpdated)
    }
    

})

router.put('/:cid/products/:pid', async (req, res) => {
    
    let validProduct = await product.getProductById(req.params.pid)
    if (validProduct.status == 200) {
        const cartExists = await cart.getCartById(req.params.cid)
        if (cartExists.status == 200) {
            const updateCart = await cart.updateCart(req.params.cid, req.params.pid, req.body.productQuantity)

            res.send(updateCart.value.products.filter(prod => prod.product._id == req.params.pid))
        }
        else {
            res.send(cartExists)
        }
    }
    else {
        res.send(validProduct)
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {

    let validProduct = await product.getProductById(req.params.pid)

    console.log(`GET prod by iddltcrt: ${JSON.stringify(validProduct)}`)

    if (validProduct.status == 200) {
        const cartExists = await cart.getCartById(req.params.cid)
        if (cartExists.status == 200) {
            const updateCart = await cart.updateCart(req.params.cid, req.params.pid, 1, true)
        
            res.send(updateCart.value)
        }
        else{
            res.send(updateCart)
        }
    }
    else {
        res.send(validProduct)
    }
})

router.delete('/:cid', async (req, res) => {
    const emptyCart = await cart.emptyCart(req.params.cid)
    res.send(emptyCart)
})

export default router