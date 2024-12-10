import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ loggedIn: false, user: null });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://fuzzy-guacamole.onrender.com/auth/check",
          {
            credentials: "include",
          }
        );
        const resData = await response.json();

        if (!resData.success) {
          throw Error("Not logged in");
        }
        setAuthState({
          loggedIn: true,
          userId: resData.username,
          username: resData.username,
        });
      } catch (err) {
        console.log(err);
        setAuthState({ loggedIn: false, userId: null });
      }
    }
    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
