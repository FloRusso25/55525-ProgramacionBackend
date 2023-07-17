export default class ProductManager {
    constructor() {
        this.products = []
        this.id = 0
    }

    validateMandatoryProperties(product) {
        const mandatoryProperties = ['title', 'description', 'price', 'thumbnail', 'code', 'stock']
        const productProperties = Object.keys(product)
        return mandatoryProperties.every((property) => productProperties.includes(property))
    }

    getProducts() {
        return this.products
    }

    addProduct(addProduct) {
        if (this.validateMandatoryProperties(addProduct)) {
            
            const codeArray = (this.products).filter(product => product.code == addProduct.code)

            if (!codeArray.length) {
                addProduct.id = this.id +1
                this.id = addProduct.id
                
                this.products.push(addProduct)
            }
            else {
                console.log(`ERROR: Already exists a product with code ${addProduct.code}`)
            }
        }
        else {
            console.log(`ERROR adding product. Some mandatory properties are missing.`)
        }      
    }

    getProductById(productId) {
        const productById = (this.products).filter(product => product.id == productId)

        if(productById.length) {
            return productById
        }
        console.log(`ERROR: Product with ID ${productId} not found.`)
        
    }
}