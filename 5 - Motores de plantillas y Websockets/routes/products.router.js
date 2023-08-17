import {Router} from 'express'
import Product from '../class/product.js'

const router = Router()
let filePath = `./files/products.json`
let product = new Product(`${filePath}`)

router.get('/', async (req,res) => {
    res.send(await product.getAllProducts(req.query.limit))
})

router.get('/:pid', async (req,res) => {

    const productId = await product.getProductById(Number(req.params.pid))

    res.status(productId.status).send(productId.value)
})

router.post('/', async (req,res) => {
    const productAdded = await product.addProduct(req.body)

    res.status(productAdded.status).send(productAdded.value)
})

router.put('/:pid', async (req,res) => {
    const productChanged = await product.updateProduct(req.params.pid, req.body)

    res.status(productChanged.status).send(productChanged.value)
})

router.delete('/:pid', async (req,res) => {

    const deleteProduct = await product.deleteProduct(Number(req.params.pid))
    
    res.status(deleteProduct.status).send(deleteProduct.value)
})

export default router