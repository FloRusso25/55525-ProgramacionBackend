import fs from 'fs'

export default class Product {
    constructor(fileName) {
        this.fileName = fileName
        this.filePath = process.cwd()
    }

    validateMandatoryProperties(product) {
        const mandatoryProperties = ['title', 'description', 'code', 'price', 'status', 'stock', 'category']
        const productProperties = Object.keys(product)
        let response = {status: 200, value: ""}

        mandatoryProperties.forEach(property => {
            console.log(`OBJECT: ${productProperties}`)
            console.log(`MANDPROP: ${property}`)
            console.log(`ISTHERE: ${mandatoryProperties[property] in productProperties}`)
            if (!(property in productProperties)) {
                response.status = 400
                response.value += `Mandatory property ${property} missing.`
            } 
            else if (product[property] != null && product[property] != undefined && product[property] != '') {
                response.status = 400
                response.value += `Mandatory property ${property} cannot be null, undefined or an empty string.`
            }
            
        });
        return response

    }

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

    async saveContentInFile(fileName, content) {
        try {
            await fs.promises.writeFile(`${this.filePath}/${fileName}`, JSON.stringify(content))
        } catch(error) {
            console.log(`ERROR saving in file. Msg: ${error}`)
        }
    }

    async addProduct(product) {
        try {
            console.log(`ADDBODY: ${JSON.stringify(product)}`)
            let content = await this.getAllProducts()
            const validateProperties = this.validateMandatoryProperties(product)
            if (validateProperties.status == 200) {
                product.id = (content.length ? Math.max(...content.map(item => item.id)) + 1 : 1)
                product.status ? product.status : true
                content.push(product)
                await this.saveContentInFile(this.fileName, content)

                return {status: 200, value: product}
            }
            else {
                console.log(`ERROR adding product. Msg: ${validateProperties.value}`)
                return {status: 400, value: `ERROR adding product. Mandatory property missing.`}
            }
            
        } catch (error) {
            console.log(`ERROR adding product. Msg: ${error}`)
            return {status: 400, value: `ERROR adding product. Msg: ${error}`}
            
        }
        
    }

    async getProductById(id) {
        try {
            const content = (await this.getAllProducts()).find(product => product.id == id)
            
            return content ? content : null 
            
        } catch (error) {
            throw new Error(`ERROR getting item with ID ${id}. Msg: ${error}`)
        }
    }

    async deleteProductById(id) {
        try {
            const content = (await this.getAllProducts()).filter(product => product.id != id)

            await this.saveContentInFile(this.fileName, content)

        } catch (error) {
           throw new Error(`ERROR deleting item with ID ${id}. Msg: ${error}`) 
        }
    }

    async deleteAllProducts() {
        try {
            await this.saveContentInFile(this.fileName, [])

        } catch (error) {
           throw new Error(`ERROR deleting item with ID ${id}. Msg: ${error}`) 
        }
    }


}