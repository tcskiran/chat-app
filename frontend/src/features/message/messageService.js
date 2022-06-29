import axios from 'axios';

const API_URL = 'http://localhost:8000/api/messages';

const addMessage = async (messageData) => {
  const response = await axios.post(API_URL + '/message', messageData);

  return response.data;
};

const getMessages = async (messageData) => {
  const response = await axios.post(API_URL + '/', messageData);

  if (response.data) {
    localStorage.setItem('messages', JSON.stringify(response.data));
  }

  return response.data;
};

const messageService = { addMessage, getMessages };

export default messageService;
