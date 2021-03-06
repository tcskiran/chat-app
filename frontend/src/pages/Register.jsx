import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaChessKnight, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordCheck: '',
  });

  const { name, email, password, passwordCheck } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, errorMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
    }

    // Redirect when logged in
    if (isSuccess) {
      toast.success('Registration successful');
      toast.info('Mail sent!!  Click link in mail to login', {
        autoClose: 7500,
      });
      navigate('/');
    }

    dispatch(reset());
  }, [isError, isSuccess, errorMessage, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      passwordCheck,
    };

    dispatch(register(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="passwordCheck"
              name="passwordCheck"
              value={passwordCheck}
              onChange={onChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
