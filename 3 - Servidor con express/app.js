import Contenedor from "./class/contenedor.js"
import express from "express"
import {getRandomProduct} from "./files/functions.js"

const products = new Contenedor('/files/productos.txt')
const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/productos', async (req, res) => {
    const productsArray = await products.getAll()
    console.log(`PRODUCTOS: ${JSON.stringify(productsArray)}`)
    res.send(productsArray)
})

app.get('/productoRandom', async (req, res) => {
    const productsArray = await products.getAll()
    console.log(`PRODUCTOS: ${JSON.stringify(productsArray)}`)
    const test = getRandomProduct(productsArray)
    console.log(`RANDOM: ${JSON.stringify(test)}`)
    res.send(test)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

