import React, { useState } from "react";
import App from "./App.jsx";
import { Context } from "./context.jsx";

const AppProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState({});

  return (
    <Context.Provider
      value={{ isAuthenticated, setIsAuthenticated, admin, setAdmin }}
    >
      <App />
    </Context.Provider>
  );
};

export default AppProvider;
