const uuidv4 = require('uuid').v4;
const webSocketServerPort = 8000;
const http = require('http');
const dotenv = require('dotenv').config();
const WebSocketServer = require('websocket').server;
const colors = require('colors');
const connectDB = require('./config/db');
const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');

connectDB();

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

const httpserver = http.createServer(app); // create server
httpserver.listen(webSocketServerPort); // listening on given port
console.log(`listening on port ${webSocketServerPort}`);

// doing handshake
const websocket = new WebSocketServer({
  httpServer: httpserver,
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use(errorHandler);

// app.listen(webSocketServerPort, () =>
//   console.log(`listening on port ${webSocketServerPort}`)
// );

// const clients = {};
// const messages = [];

// // what to do if there is a request in handshake
// websocket.on('request', (request) => {
//   var userId = uuidv4();

//   const connection = request.accept(null, request.origin); // accepting the request
//   clients[userId] = connection; // adding the current user to the list of clients

//   // sending prev messages to new user
//   clients[userId].sendUTF(
//     JSON.stringify({
//       type: 'all-messages',
//       messages,
//       userId,
//     })
//   );

//   // if we recieve any new message from any client
//   connection.on('message', (message) => {
//     // sending the message to all clients
//     if (message.type === 'utf8') {
//       const dataFromClient = JSON.parse(message.utf8Data);
//       messages.push({ msg: dataFromClient.msg, user: dataFromClient.user });
//       for (key in clients) {
//         clients[key].sendUTF(message.utf8Data); // sending the message to all clients
//       }
//     }
//   });
// });
