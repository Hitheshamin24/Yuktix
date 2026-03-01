import React from "react";
import { useNavigate, Link } from "react-router";
const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form>
          <div className="input-group">
            <label htmlFor="email">User Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter UserName"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="******"
            />
          </div>
          <button onClick={handleSubmit} className="button primary-button">
            Register
          </button>
        </form>
        <p>
          Already have an Account ? <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
