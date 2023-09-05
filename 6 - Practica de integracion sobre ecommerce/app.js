//import
import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import {Server} from 'socket.io'
import viewsRouter from './routes/views.router.js'
import mongoose from 'mongoose'


//express
const app = express()
const PORT = 8080
let productsList = []
const dataBase = `ecommerce`
const dbClusterName = `ecommercecluster`

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
const socketServer = new Server(server)

app.engine('handlebars', handlebars.engine())

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// mongoose.connect(`mongodb+srv://florusso:9GjiqVqIAIC0pUCm@${dbClusterName}.y05wmrq.mongodb.net/${dataBase}?retryWrites=true&w=majority`, error => {
//     if (error) {
//         console.log(`Cannot connect to database ${dataBase}: ${error}`)
//         process.exit()
//     }
// })

mongoose.connect(`mongodb+srv://florusso:9GjiqVqIAIC0pUCm@${dbClusterName}.y05wmrq.mongodb.net/${dataBase}?retryWrites=true&w=majority`)
    .then (() => {
        console.log(`Connected to Mongo Atlas ${dataBase} database.`)
    })
    .catch( error => {
        console.error(`Cannot connect to database ${dataBase}: ${error}`)
    })

app.use('/', viewsRouter)

socketServer.on('connection', socket => {
    console.log("New connection started")

    socket.emit('productsList', productsList)

    socket.on('addProduct', () => {
        
        io.sockets.emit('productsList', productsList)
    });
})

