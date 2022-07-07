import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { checkEmail, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Confirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, errorMessage } = useSelector(
    (state) => state.auth
  );

  let { token } = useParams();

  // sending request to server to check email as page is opened only once
  useEffect(() => {
    dispatch(checkEmail(token));
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
    }

    if (isSuccess) {
      toast.success('Email confirmed successfully');
      navigate('/');
    }

    dispatch(reset());
  }, [isError, isSuccess]);

  if (isLoading) {
    return <Spinner />;
  }

  return <h1>Confirmation Page</h1>;
}

export default Confirmation;
