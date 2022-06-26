import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function AllUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  // console.log(users);

  let userList = users.users.map((data) => {
    return (
      <div className="user-box">
        <p>{data.name}</p>
      </div>
    );
  });

  return <>{userList}</>;
}

export default AllUsers;
