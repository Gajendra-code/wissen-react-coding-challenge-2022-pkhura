import React, { useRef, useState } from 'react';
import { render } from 'react-dom';
import './style.css';
import axios from 'axios';

const logoUrl =
  'https://drive.google.com/uc?export=view&id=1hvRAGrdq0SqFBZApx2--IcuDf-DOmOBH';

const App = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loginMessage, setLoginMessage] = useState({
    message: '',
    isError: false,
  });
  const [isError, setIsError] = useState({ email: false, password: false });
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [userList, setUserList] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    let emailVal = emailRef.current.value;
    let passVal = passwordRef.current.value;

    if (isValid(emailVal, passVal)) {
      login(emailVal, passVal);
    }
  };
  const isValid = (email, password) => {
    if (email.trim() === '') {
      setIsError((prevState) => (prevState = { ...prevState, email: true }));
      return false;
    } else {
      setIsError((prevState) => (prevState = { ...prevState, email: false }));
    }
    if (password.trim() === '') {
      setIsError((prevState) => (prevState = { ...prevState, password: true }));
      return false;
    } else {
      setIsError(
        (prevState) => (prevState = { ...prevState, password: false })
      );
    }
    return true;
  };
  const login = (email, password) => {
    axios
      .post('https://reqres.in/api/login', {
        email,
        password,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setLoginMessage(
            (prevState) =>
              (prevState = {
                ...prevState,
                message: 'Successfully logged',
                isError: false,
              })
          );
          fetchUserList(response.data.token);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoginMessage(
          (prevState) =>
            (prevState = {
              ...prevState,
              message: 'Invalid username /password',
              isError: true,
            })
        );
      });
  };
  const fetchUserList = (token) => {
    axios
      .get('https://reqres.in/api/unknown', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        console.log('user list', response.data.data);
        setUserList(response.data.data);
      })
      .catch((error) => {
        console.log('user list', error);
      });
  };

  return (
    <div>
      <div>
        <div className="w-75 mx-auto">
          <div>
            {userList.length === 0 && (
              <React.Fragment>
                <h3>Hello there, Sign in to continue</h3>
                <form onSubmit={submitHandler}>
                  <div className="form-group">
                    <label htmlFor="email-id">Username/Email</label>
                    <input
                      type="text"
                      id="email-Id "
                      className="form-control mt-2"
                      ref={emailRef}
                    />
                    {isError.email && (
                      <div className="error">A valid email id is required </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="passowrd-id">Password</label>
                    <input
                      type="password"
                      id="passowrd-id"
                      className="form-control mt-2"
                      ref={passwordRef}
                    />
                    {isError.password && (
                      <div className="error">Password is mandatory</div>
                    )}
                  </div>
                  <div className="form-group form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="termsAndCondition"
                      onChange={(e) =>
                        setIsTermsAccepted((prevState) => !prevState)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="termsAndCondition"
                    >
                      By creating or logging into account, you are agreeing with
                      our <b>Terms & Condition</b> and <b>Privacy Policys</b>
                    </label>
                  </div>
                  <button
                    className={`btn dark-blue mt-2 
              ${isTermsAccepted === false ? 'disabled' : ''}`}
                  >
                    Login
                  </button>
                </form>
              </React.Fragment>
            )}
            {loginMessage.message !== '' && (
              <p
                className={`alert mt-2 ${
                  loginMessage.isError ? 'alert-danger' : ' alert-success'
                }`}
              >
                {loginMessage.message}
              </p>
            )}
            {/* User List code starts here */}
            {userList.length > 0 && (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((item) => (
                    <tr key={item.id}>
                      <td className="col-sm-4">{item.name}</td>
                      <td className="col-sm-4">{item.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
