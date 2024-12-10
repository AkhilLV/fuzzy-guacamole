import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../components/AuthProvider/AuthProvider";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setAuthState } = useAuth();

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://fuzzy-guacamole.onrender.com/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.status !== 200) {
        throw Error("Not authenticated");
      }

      const resData = await response.json();

      setAuthState({
        loggedIn: true,
        userId: resData.userId,
        username: resData.username,
      });

      navigate(`/dashboard${window.location.search}`);
    } catch (err) {
      alert("Wrong creds");
      console.log(err);
    }
  };

  return (
    <div className="auth-contain">
      <h1 className="auth-heading">Login</h1>

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
          Sign in
        </button>

        <Link to={`/register${window.location.search}`}>
          No account yet? Sign up
        </Link>
      </form>
    </div>
  );
}
