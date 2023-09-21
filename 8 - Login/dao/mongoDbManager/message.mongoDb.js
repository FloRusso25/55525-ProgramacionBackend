//import
import messageModel from "../models/message.model.js"

export default class Message {
    constructor() {
    }

    //Get all products in products database
    async getMessages() {
        return await messageModel.find()
    }

    //Adds a product to the products collection
    async addMessage(message) {
        try{
            const newMessage = await messageModel.create(message);
            return {status: 200, value: newMessage};
            
        }catch (error) {
            console.log (`ERROR adding message ${message}. Msg: ${error}`)
            return {status: 400, error: `ERROR adding new message ${JSON.stringify(message)}. Msg: ${error}`}
        }        
    }
}
