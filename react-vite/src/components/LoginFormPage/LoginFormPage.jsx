import { useState, useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [block, setBlock] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let errObj = {};

    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]/;
    if (
      email.length === 0 ||
      email.length > 65 ||
      !email.match(validRegex) ||
      password.length < 6
    ) {
      setBlock(true);
    } else {
      setBlock(false);
    }

    if (email.length === 0) errObj.email = "Please provide a valid Email";
    if (email.length > 65) errObj.email = "Email must be 65 characters or less";
    if (!email.match(validRegex)) errObj.email = "Please provide a valid Email";
    if (password.length < 6)
      errObj.password = "Please provide a password of at least 6 characters";

    setErrors(errObj);
  }, [email, password]);

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  async function handleDemoLogin(e) {
    e.preventDefault();
    const loginDemo = await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );
    if (loginDemo) {
      setErrors(loginDemo);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="login-holder">
      <div className="login-container">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <label htmlFor="email">Email</label>
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <input
              type="text"
              id="email"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <label htmlFor="password">Password</label>
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button id="login-button" type="submit" disabled={block}>
            Log In
          </button>
        </form>
        <button id="demo-button" onClick={(e) => handleDemoLogin(e)}>
          Login Demo User
        </button>
      </div>
    </div>
  );
}

export default LoginFormPage;
