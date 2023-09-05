import productModel from "../models/product.model.js"

export default class Product {
    constructor() {}

    //Validates mandatory properties are sent in product object
    validateMandatoryProperties(product) {
        const mandatoryProperties = ['title', 'description', 'code', 'price', 'stock', 'category']
        const availableProperties = ['thumbnail', 'status']
        const productProperties = Object.keys(product)
        let response = {status: 200, value: ""}

        mandatoryProperties.forEach(property => {
            if (!(productProperties.includes(property))) {
                response.status = 400
                response.value += `Mandatory property ${property} missing.`
            } 
            else if (product[property] == null && product[property] == undefined && product[property] == '') {
                response.status = 400

                response.value += `Mandatory property ${property} cannot be null, undefined or an empty string.`
            }
            
        });
        
        return response

    }

    //Gets all products stored in file. If a limit is sent, gets all products which ids are lower than limit
    async getAllProducts(limit = undefined) {
        const products = await productModel.find()

        if (limit != undefined) {
            products = products.slice(0, limit + 1)
        }

        return products
    }

    //Adds a product to the file
    async addProduct(product) {

        try {
            let content = await productModel.findOne({title: `${product.title}`})

            if (content != null) {
                console.log(`ERROR: Product already exists.`)
                return {status: 403, value: `ERROR: product already exists. Please use update PUT query instead`};
            }
            const validateProperties = this.validateMandatoryProperties(product)
                        
            if (validateProperties.status == 200) {
                if ('id' in product) {
                    console.log(`ERROR: ID property cannot be sent in body.`)
                    return {status: 400, value: `ERROR: ID property cannot be sent in body.`}
                }
                product.status = product.status ? product.status : true

                const result = await productModel.create(product);
                return {status: 200, value: result};
            }
            else {
                console.log(`ERROR adding product. Msg: ${validateProperties.value}`)
                return {status: 400, value: `ERROR adding product. Msg: ${validateProperties.value}`}
            }
            
        } catch (error) {
            console.log(`ERROR adding product. Msg: ${error}`)
            return {status: 400, value: `ERROR adding product. Msg: ${error}`}   
        } 
    }

    //Gets a product that matches ID.
    async getProductById(id) {

        try {

            const content = await productModel.findById(id)
            return content ? {status: 200, value: content} : {status: 404, value: `Product with ID ${id} not found`} 
            
        } catch (error) {
            throw new Error(`ERROR getting item with ID ${id}. Msg: ${error}`)
        }
    }

    //Deletes a product by ID. 
    async deleteProduct(id) {
        try {
            const content = await productModel.findOneAndDelete({_id: `${id}`})

            return content ? {status: 200, value: `Product ${id} deleted`} : {status: 404, value: `Product with ID ${id} not found`} 

        } catch (error) {
           console.log(`ERROR deleting item with ID ${id}. Msg: ${error}`)
           return {status: 400, value: `ERROR deleting item with ID ${id}. Msg: ${error}`} 
        }
    }

    //Deletes all products saving empty array in file
    async deleteAllProducts() {
        try {
            await this.saveContentInFile(this.fileName, [])

        } catch (error) {
           throw new Error(`ERROR deleting item with ID ${id}. Msg: ${error}`) 
        }
    }

    //Updates the property with value of a product with matching id  
    async updateProduct(id, newValues) {
        try {
            let oldProduct = await this.getProductById(id)

            if (oldProduct.status == 404) {
                return {oldProduct}
            }
            oldProduct = oldProduct.value
            Object.keys(newValues).forEach(property => {
                if (property != 'id') {
                    
                    oldProduct[property] = newValues[property]
                } else {
                    console.log(`ERROR: ID property cannot be sent in body.`)
                    return {status: 400, value: `ERROR: ID property cannot be sent in body.`}
                }
            });
                       
            let products = (await this.getAllProducts()).filter(item => item.id != id)
            products.push(oldProduct)

            await this.saveContentInFile(this.fileName, products)

            return {status: 200, value: oldProduct}
        }
        catch (error) {
            return {status: 400, error: `there is an invalid property trying to be modified.`}
        }
    }
}