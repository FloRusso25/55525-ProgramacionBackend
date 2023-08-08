import fs from 'fs'

export default class Product {
    constructor(fileName) {
        this.fileName = fileName
        this.filePath = process.cwd()
    }

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
        try {
            let content = await fs.promises.readFile(`${this.filePath}/${this.fileName}`, 'utf-8')
            if (content) {
                content = JSON.parse(content)
                content = (limit != undefined ? content.filter(item => item.id <= limit) : content)
            }
            return content ? content : []

        } catch (error) {
            throw new Error(`ERROR getting all products. Msg: ${error}`)
        }
    }

    //Saves content in file using JSON string format
    async saveContentInFile(fileName, content) {
        try {
            await fs.promises.writeFile(`${this.filePath}/${fileName}`, JSON.stringify(content))
        } catch(error) {
            console.log(`ERROR saving in file. Msg: ${error}`)
        }
    }

    //Adds a product to the file
    async addProduct(product) {
        try {
            let content = await this.getAllProducts()
            const validateProperties = this.validateMandatoryProperties(product)
            if (validateProperties.status == 200) {
                if ('id' in product) {
                    console.log(`ERROR: ID property cannot be sent in body.`)
                    return {status: 400, value: `ERROR: ID property cannot be sent in body.`}
                }
                product.id = (content.length ? Math.max(...content.map(item => item.id)) + 1 : 1)
                product.status = product.status ? product.status : true
                content.push(product)
                await this.saveContentInFile(this.fileName, content)

                return {status: 200, value: product}
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
            const content = (await this.getAllProducts()).find(product => product.id == id)
            
            return content ? {status: 200, value: content} : {status: 404, value: `Product with ID ${id} not found`} 
            
        } catch (error) {
            throw new Error(`ERROR getting item with ID ${id}. Msg: ${error}`)
        }
    }

    //Deletes a product by ID. 
    async deleteProduct(id) {
        try {
            const content = (await this.getAllProducts()).filter(product => product.id != id)

            await this.saveContentInFile(this.fileName, content)

            return {status: 200, value: `Product ${id} deleted`}

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