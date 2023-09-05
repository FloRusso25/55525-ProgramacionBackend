import express from 'express'
import Product from '../dao/mongoDbManager/product.mongoDb.js'

const router = express.Router()
let product = new Product()
let productsList = []


router.get('/', async (req,res) => {
    let productsData = await product.getAllProducts()
    res.render('home', {layout: 'main', productsData})
})

router.get('/realtimeproducts', async (req,res) => {
    productsList = await product.getAllProducts()
    res.render('realTimeProducts', {layout: 'main', productsList})
})

router.post('/realtimeproducts', async (req,res) => {
    productsList = await product.getAllProducts()
    let errorDelete = false

    if (req.query.method == 'DELETE') {
        const prodToDelete = await product.getProductById(Number(req.body.id))

        if (prodToDelete.status == 200) {

            const deleteProduct = await product.deleteProduct(Number(req.body.id))
            productsList = productsList.filter(item => item.id != Number(req.body.id))     
            
            res.render('realTimeProducts', {layout: 'main', productsList, errorDelete})
        }
        else {
            errorDelete = true
            const errorMessage = `Product with ID ${Number(req.body.id)} doesn't exist`

            res.render('realTimeProducts', {layout: 'main', productsList, errorDelete, errorMessage})
        }

        
    }
    else{

        const productAdded = await product.addProduct(req.body)
        productsList.push(req.body)
        res.render('realTimeProducts', {layout: 'main', productsList})
    }
})

export default router