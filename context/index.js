import { useState, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    initialized: false,
    userDetails: {
      openModal: false,
      user: null,
      name: '',
    },
  });

  const router = useRouter();

  useEffect(() => {
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    setState({
      ...state,
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
