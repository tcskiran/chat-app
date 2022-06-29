import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignInAlt, FaUser } from 'react-icons/fa';
import AllUsers from './AllUsers';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {user ? (
        <>
          <AllUsers />
        </>
      ) : (
        <>
          <div className="home-heading">
            <h1>Want to send messages!!</h1>
            <h2>Dive into the app!!!</h2>
          </div>

          <Link to="/login">
            <FaSignInAlt /> Login
          </Link>

          <Link to="/register">
            <FaUser /> Register
          </Link>
        </>
      )}
    </>
  );
}

export default Home;
