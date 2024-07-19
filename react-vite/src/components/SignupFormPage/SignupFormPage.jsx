import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [block, setBlock] = useState(false);

  useEffect(() => {
    let errObj = {};

    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]/;
    if (
      email.length === 0 ||
      email.length > 65 ||
      !email.match(validRegex) ||
      username.length < 4 ||
      username.length > 30 ||
      password.length < 6 ||
      password !== confirmPassword
    ) {
      setBlock(true);
    } else {
      setBlock(false);
    }

    if (email.length === 0) errObj.email = "Please provide a valid Email";
    if (!email.match(validRegex)) errObj.email = "Please provide a valid Email";
    if (email.length > 65) errObj.email = "Email must be 65 characters or less";
    if (username.length < 4)
      errObj.username = "Please provide a Username of at least 4 characters";
    if (username.length > 30)
      errObj.username = "Username must be 30 characters or less";
    if (password.length < 6)
      errObj.password = "Please provide a password of at least 6 characters";
    if (password !== confirmPassword)
      errObj.confirmPassword = "Please ensure both passwords match";

    setErrors(errObj);
  }, [email, username, password, confirmPassword]);

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="sign-up-holder">
      <h1>Sign Up</h1>
      {errors.server && <p className="errors">{errors.server}</p>}
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
            <label htmlFor="username">Username</label>
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
          </div>
          <input
            type="text"
            id="username"
            className="email-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <div className="form-group last">
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button id="signup-button" type="submit" disabled={block}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormPage;
