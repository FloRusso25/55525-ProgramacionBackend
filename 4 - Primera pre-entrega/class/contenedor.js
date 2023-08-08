import fs from 'fs'

export default class Contenedor {
    constructor(fileName) {
        this.fileName = fileName
        this.filePath = process.cwd()
    }

    validateMandatoryProperties(product) {
        const mandatoryProperties = ['title', 'price', 'thumbnail']
        const productProperties = Object.keys(product)
        return mandatoryProperties.every((property) => productProperties.includes(property) && product[property] != null && product[property] != undefined && product[property] != '' )

    }

    async getAll() {
        try {
            const content = await fs.promises.readFile(`${this.filePath}/${this.fileName}`, 'utf-8')
            
            return content ? JSON.parse(content) : []

        } catch (error) {
            throw new Error(`ERROR reading file. Msg: ${error}`)
        }
    }

    async saveContentInFile(fileName, content) {
        try {
            await fs.promises.writeFile(`${this.filePath}/${fileName}`, JSON.stringify(content))
        } catch(error) {
            console.log(`ERROR saving in file. Msg: ${error}`)
        }
    }

    async save(object) {
        try {
            let content = await this.getAll()

            if (this.validateMandatoryProperties(object)) {
                object.id = (content.length ? Math.max(...content.map(item => item.id)) + 1 : 1)
                content.push(object)
                await this.saveContentInFile(this.fileName, content)
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
            const content = (await this.getAll()).filter(product => product.id != id)

            await this.saveContentInFile(this.fileName, content)

        } catch (error) {
           throw new Error(`ERROR deleting item with ID ${id}. Msg: ${error}`) 
        }
    }

    async deleteAll() {
        try {
            await this.saveContentInFile(this.fileName, [])

        } catch (error) {
           throw new Error(`ERROR deleting item with ID ${id}. Msg: ${error}`) 
        }
    }


}