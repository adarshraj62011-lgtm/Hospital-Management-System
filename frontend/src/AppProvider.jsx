import React, { useState } from "react";
import App from "./App.jsx";
import { Context } from "./context.jsx";

const AppProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      <App />
    </Context.Provider>
  );
};

export default AppProvider;
