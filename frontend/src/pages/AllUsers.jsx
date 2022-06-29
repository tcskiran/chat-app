import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers } from '../features/auth/authSlice';
import { addMessage, getMessages } from '../features/message/messageSlice';
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.min.css';
import Spinner from '../components/Spinner';

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

function AllUsers() {
  const dispatch = useDispatch();

  let { users, user } = useSelector((state) => state.auth);
  dispatch(getUsers());

  const [usersData, setUsersData] = useState(users);
  const [userData, setUserData] = useState(user);
  const [reciever, setReciever] = useState(user?.email);
  const [messagesData, setMessagesData] = useState();
  const [searchVal, setSearchVal] = useState('');

  const onButtonClick = () => {
    dispatch(
      addMessage({
        message: searchVal,
        emailFrom: user.email,
        emailTo: reciever,
      })
    );
    setSearchVal('');
  };

  useEffect(() => {
    let checkUsers = setInterval(() => {
      dispatch(getUsers());
      setUserData(JSON.parse(localStorage.getItem('user')));
      setUsersData(JSON.parse(localStorage.getItem('users')));

      dispatch(getMessages({ email1: userData.email, email2: reciever }));
      setMessagesData(JSON.parse(localStorage.getItem('messages')));
      console.log('messages=>', messagesData.messages);
    }, 2000);
    // runs when component gets unmounted
    return () => {
      clearInterval(checkUsers);
    };
  }, [userData, reciever, messagesData]);

  return (
    <>
      <div className="warp-home">
        <div className="box-home-user">
          {usersData?.users?.map((data, index) => {
            return (
              <div
                key={index}
                className="user-box"
                onClick={() => {
                  setReciever(data.email);
                }}
              >
                <p>{data.name}</p>
              </div>
            );
          })}
        </div>
        <div className="box-home-messages">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: 50,
            }}
          >
            {messagesData?.messages?.map((message, index) => (
              <Card
                key={index}
                style={{
                  width: 300,
                  margin: '16px 4px 0 10px',
                  backgroundColor:
                    message.messageFrom === userData._id
                      ? '#ea7b7b'
                      : '#97abe7',
                  alignSelf:
                    message.messageFrom === userData._id
                      ? 'flex-end'
                      : 'flex-start',
                }}
                loading={false}
              >
                <Meta
                  avatar={
                    <Avatar
                      style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                    >
                      {message.messageFrom === userData._id
                        ? messagesData.name1[0].toUpperCase()
                        : messagesData.name2[0].toUpperCase()}
                    </Avatar>
                  }
                  title={
                    message.messageFrom === userData._id
                      ? messagesData.name1
                      : messagesData.name2
                  }
                  description={message.message}
                />
              </Card>
            ))}
          </div>
          <div className="bottom">
            <Search
              placeholder="input message"
              enterButton="Send"
              value={searchVal}
              size="large"
              autoFocus
              onChange={(e) => {
                setSearchVal(e.target.value);
              }}
              onSearch={onButtonClick}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AllUsers;
