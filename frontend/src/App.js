// const uuidv4 = require('uuid').v4;
// import { createRoot } from 'react-dom/client';
// import React, { Component, useState } from 'react';
// import { w3cwebsocket as W3CWebSocket } from 'websocket';
// import { Card, Avatar, Input, Typography } from 'antd';
// import 'antd/dist/antd.min.css';
// import './index.css';

// const { Search } = Input;
// const { Text } = Typography;
// const { Meta } = Card;

// // sending a request to server to connect
// const client = new W3CWebSocket('ws://127.0.0.1:8000');
// console.log(client);
// export default class App extends Component {
//   state = {
//     userName: '',
//     userId: null,
//     isLoggedIn: false,
//     messages: [],
//   };

//   // sending data to server
//   onButtonClick = (value) => {
//     client.send(
//       JSON.stringify({
//         type: 'message',
//         msg: value,
//         user: this.state.userName,
//         userId: this.state.userId,
//       })
//     );
//     this.setState({ searchVal: '' }); // clearing the message bar
//   };

//   // if we get any message we add it to messages
//   componentDidMount() {
//     client.onmessage = (message) => {
//       const dataFromServer = JSON.parse(message.data);
//       console.log(dataFromServer);
//       if (dataFromServer.type === 'message') {
//         this.setState((state) => ({
//           messages: [
//             ...state.messages,
//             {
//               msg: dataFromServer.msg,
//               user: dataFromServer.user,
//               userId: dataFromServer.userId,
//             },
//           ],
//         }));
//       }
//       if (dataFromServer.type === 'all-messages') {
//         this.setState((state) => ({
//           userId: dataFromServer.userId,
//           messages: dataFromServer.messages,
//         }));
//       }
//     };
//   }

//   render() {
//     return (
//       <div className="main">
//         {this.state.isLoggedIn ? (
//           <div>
//             <div className="title">
//               <Text
//                 id="main-heading"
//                 type="secondary"
//                 style={{ fontSize: '36px', color: 'white' }}
//               >
//                 Chat user: {this.state.userName}
//               </Text>
//             </div>
//             <div
//               style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 paddingBottom: 50,
//               }}
//               id="messages"
//             >
//               {this.state.messages.map((message) => (
//                 <Card
//                   key={uuidv4()}
//                   style={{
//                     width: 300,
//                     margin: '16px 4px 0 10px',
//                     backgroundColor:
//                       this.state.userId === message.userId
//                         ? '#ea7b7b'
//                         : '#97abe7',
//                     alignSelf:
//                       this.state.userId === message.userId
//                         ? 'flex-end'
//                         : 'flex-start',
//                   }}
//                   loading={false}
//                 >
//                   <Meta
//                     avatar={
//                       <Avatar
//                         style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
//                       >
//                         {message.user[0].toUpperCase()}
//                       </Avatar>
//                     }
//                     title={message.user}
//                     description={message.msg}
//                   />
//                 </Card>
//               ))}
//             </div>
//             <div className="bottom">
//               <Search
//                 placeholder="input message"
//                 enterButton="Send"
//                 value={this.state.searchVal}
//                 size="large"
//                 autoFocus
//                 onChange={(e) => {
//                   this.setState({ searchVal: e.target.value });
//                 }}
//                 onSearch={(value) => {
//                   this.onButtonClick(value);
//                 }}
//               />
//             </div>
//           </div>
//         ) : (
//           <>
//             <div
//               style={{
//                 textAlign: 'center',
//                 fontSize: '36px',
//                 color: 'white',
//                 backgroundColor: 'black',
//               }}
//             >
//               Login Page
//             </div>
//             <div className="login">
//               <Search
//                 placeholder="Enter Username"
//                 enterButton="Login"
//                 size="large"
//                 autoFocus
//                 onSearch={(value) =>
//                   this.setState({ isLoggedIn: true, userName: value })
//                 }
//               />
//             </div>
//           </>
//         )}
//       </div>
//     );
//   }
// }

// root.render(<App />);

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { Component, useState } from 'react';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
      <Router>
        <div className="conatiner">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
