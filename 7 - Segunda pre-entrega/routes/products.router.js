import {Router} from 'express'
import Product from '../dao/mongoDbManager/product.mongoDb.js'

const router = Router()
let product = new Product()

router.get('/', async (req,res) => {
    const urlProds = `http://localhost:8080/api/products`

    res.send(await product.getAllProducts(req.query.limit, req.query.page, req.query.sort, req.query.query, urlProds))
})

router.get('/:pid', async (req,res) => {

    const productId = await product.getProductById(req.params.pid)

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

    const deleteProduct = await product.deleteProduct(req.params.pid)
    
    res.status(deleteProduct.status).send(deleteProduct.value)
})

export default router