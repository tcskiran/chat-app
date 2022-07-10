import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/messages`;

const addMessage = async (messageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + '/message', messageData, config);

  return response.data;
};

const getMessages = async (messageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + '/', messageData, config);

  if (response.data) {
    localStorage.setItem('messages', JSON.stringify(response.data));
  }

  return response.data;
};

const messageService = { addMessage, getMessages };

export default messageService;
