import server from '../app.js'
import {Server} from 'socket.io'
var io = Server.listen(server)
module.exports = io