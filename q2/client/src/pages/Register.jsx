import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../components/AuthProvider/AuthProvider";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();
  const { setAuthState } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const resData = await response.json();

      if (!resData.success) {
        throw Error("Not authenticated");
      }

      setAuthState({
        loggedIn: true,
        userId: resData.userId,
        username: resData.username,
      });

      navigate(`/dashboard${window.location.search}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth-contain">
      <h1 className="auth-heading">Register</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" className="primary">
          Register
        </button>

        <Link to={`/login${window.location.search}`}>
          Already have an account? Sign in instead
        </Link>
      </form>
    </div>
  );
}
