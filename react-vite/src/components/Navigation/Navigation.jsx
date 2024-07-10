import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";

import "./Navigation.css";

function Navigation() {
  let sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const goHome = () => {
    navigate("/");
  };
  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="navbar">
      <div className="logoDiv"></div>

      <nav className="nav-links">
        <NavLink to="/areas" className="nav-link">
          Areas
        </NavLink>
        <NavLink to="/routes" className="nav-link">
          Routes
        </NavLink>
        <NavLink to="/ascents" className="nav-link">
          Ascents
        </NavLink>
        <NavLink to="/climbers" className="nav-link">
          Climbers
        </NavLink>
      </nav>
      {!sessionUser && (
        <div className="login">
          <button onClick={goToLogin}>Login</button>
          <div className="signup">
            <button onClick={goToSignup}>Sign Up</button>
          </div>
        </div>
      )}
      {sessionUser && (
        <div id="logged-container">
          <div id="profile">
            <ProfileButton user={sessionUser} className="profile-button" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
