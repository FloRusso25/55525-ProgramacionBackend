import ProductManager from "./class/ProductManager.js"

const productManager = new ProductManager

const product1 = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
}

const product2 = {
    title: 'producto 2',
    description: 'Este es un segundo producto',
    price: 300,
    thumbnail: 'Sin imagen',
    code: 'abc124',
    stock: 2
}

const productNotValid = {
    title: 'producto 3',
    description: 'Este es un segundo producto',
    price: 300,
    thumbnail: 'Sin imagen',
    code: 'abc125'
}

//Print empty array of products
let products = productManager.getProducts()
console.log(`Available products: \n ${JSON.stringify(products)}`)

//Add product1 to array of products
onsole.log(`Adding product1`)
productManager.addProduct(product1)

//Print array of products with product1
products = productManager.getProducts()
console.log(`Product 1 added: \n ${JSON.stringify(products)}`)

//Add productNotValid missing stock property
console.log(`Adding product without a mandatory property`)
productManager.addProduct(productNotValid)

//Add product1 again
console.log(`Adding product1 again`)
productManager.addProduct(product1)

//Add product2
console.log(`Adding product2`)
productManager.addProduct(product2)
console.log(`Product 2 added: \n ${JSON.stringify(products)}`)

//Get a product by ID
console.log(`Looking for product with ID 1`)
const productFound = productManager.getProductById(1)
console.log(`Product with ID 1: \n ${JSON.stringify(productFound)}`)

//Get a product by ID that does not exist
console.log(`Looking for product with ID 5`)
const productNotFound = productManager.getProductById(5)
console.log(`Product with ID 5 not found: \n ${JSON.stringify(productNotFound)}`)
