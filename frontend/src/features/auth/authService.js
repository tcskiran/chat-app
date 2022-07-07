import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users';

const register = async (userData) => {
  const response = await axios.post(API_URL + '/register', userData);
  return response.data;
};

const checkEmail = async (token) => {
  const response = await axios.get(API_URL + '/confirmation/' + token);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + '/login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('users');
  localStorage.removeItem('messages');
};

const getUsers = async () => {
  const response = await axios.get(API_URL + '/');

  if (response.data) {
    localStorage.setItem('users', JSON.stringify(response.data));
  }

  return response.data;
};

const authService = {
  register,
  checkEmail,
  login,
  logout,
  getUsers,
};

export default authService;
