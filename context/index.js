import { useState, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    initialized: false,
  });

  const router = useRouter();

  useEffect(() => {
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    setState({
      user: userInfo?.user,
      token: userInfo?.token,
      initialized: true,
    });
  }, []);

  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
