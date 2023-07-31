import fs from 'fs'

export default class Contenedor {
    constructor(fileName) {
        this.fileName = fileName
    }

    validateMandatoryProperties(product) {
        const mandatoryProperties = ['title', 'price', 'thumbnail']
        const productProperties = Object.keys(product)
        return mandatoryProperties.every((property) => productProperties.includes(property))
    }

    async getAll() {
        try {
            const filePath = process.cwd()
            const content = await fs.promises.readFile(`${filePath}/${this.fileName}`, 'utf-8')
            
            return content ? JSON.parse(content) : []

        } catch (error) {
            throw new Error(`ERROR reading file. Msg: ${error}`)
        }
    }

    async setId(content) {
        try {
            return (content.length ? Math.max(...content.map(item => item.id)) + 1 : 1)
          
        } catch (error) {
            throw new Error(`ERROR setting ID. Msg: ${error}`)
        }
        
    }

    async save(object) {
        try {
            let content = await this.getAll()

            if (this.validateMandatoryProperties(object)) {
                object.id = await this.setId(content)
                content.push(object)
                const filePath = process.cwd()
                await fs.promises.writeFile(`${filePath}/${this.fileName}`, JSON.stringify(content))
            }
            else {
                console.log(`ERROR saving object. Mandatory property missing.`)
            }
            
        } catch (error) {
            throw new Error(`ERROR saving object. Msg: ${error}`)
        }
        
    }

    async getById(id) {
        try {
            const content = (await this.getAll()).find(product => product.id == id)
            
            return content ? content : null 
            
        } catch (error) {
            throw new Error(`ERROR getting item with ID ${id}. Msg: ${error}`)
        }
    }

    async deleteById(id) {
        try {
            const filePath = process.cwd()
            const content = (await this.getAll()).filter(product => product.id != id)

            await fs.promises.writeFile(`${filePath}/${this.fileName}`, JSON.stringify(content))

        } catch (error) {
           throw new Error(`ERROR deleting item with ID ${id}. Msg: ${error}`) 
        }
    }

    async deleteAll() {
        try {
            const filePath = process.cwd()
            await fs.promises.writeFile(`${filePath}/${this.fileName}`, [] )

        } catch (error) {
           throw new Error(`ERROR deleting item with ID ${id}. Msg: ${error}`) 
        }
    }


}