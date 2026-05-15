import { createContext } from "react";
const IsLoginContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export default IsLoginContext;
