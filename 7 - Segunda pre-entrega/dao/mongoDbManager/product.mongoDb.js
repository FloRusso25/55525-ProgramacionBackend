import productModel from "../models/product.model.js"
import mongoose from 'mongoose'
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
    async getAllProducts(limit = 10, page = 1, sort = undefined, query = {}, baseUrl) {

        let options = {
            limit: `${limit}`,
            page: `${page}`,
            lean: true
        }
        
        if (sort == 'asc' || sort == 'desc') {
            options.sort = {price: `${sort}`}
        }

        if (query.length > 0) {
            query = JSON.parse(query)
        }

        try {
            const products = await productModel.paginate(query, options)

            let response = {
                status: 'success', 
                payload: products.docs, 
                totalPages: products.totalPages, 
                prevPage: products.prevPage, 
                nextPage: products.nextPage, 
                page:products.page, 
                hasPrevPage: products.hasPrevPage, 
                hasNextPage: products.hasNextPage, 
                prevLink: null, 
                nextLink: null
            }

            if (response.hasPrevPage) {
                response.prevLink = `${baseUrl}/?limit=${limit}&page=${page - 1}&sort=${sort}&query=${JSON.stringify(query)}`
            }
            if (response.hasNextPage) {
                response.nextLink = `${baseUrl}/?limit=${limit}&page=${page + 1}&sort=${sort}&query=${JSON.stringify(query)}`
            }
       
            return response

        } catch (error) {
            return {status: 'error', payload: `${error}`, totalPages: NaN, prevPage: NaN, nextPage: NaN, page:NaN, hasPrevPage: false, hasNextPage: false, prevLink: null, nextLink: null}
        }
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

            const content = await productModel.findById(new mongoose.Types.ObjectId(id))
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
            await this.deleteMany({})

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
                       
            oldProduct = await productModel.findOneAndUpdate({_id: `${oldProduct._id}`}, oldProduct)

            return {status: 200, value: oldProduct}
        }
        catch (error) {
            return {status: 400, error: `there is an invalid property trying to be modified.`}
        }
    }
}