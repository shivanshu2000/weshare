import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import { UserContext } from '../context';

export default function PrivateRoute({ children }) {
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    // if (!state.user && !state.token){
    //    return
    // }
    if (state.initialized) {
      getCurrentUser();
    }
  }, [state.token]);
  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/user/current-user`,
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );

      setVerified(true);
    } catch (err) {
      console.log(err.response);
      setVerified(false);
      if (
        err.response.data.error === 'jwt expired' ||
        err.response.data.error === 'jwt malformed'
      ) {
        console.log(state, 'in private route');
        setState({ ...state, user: null, token: null });
        window.localStorage.removeItem('userInfo');
        router.push('/login');
      }
    }
  };

  return <>{verified ? children : <div>Loading...</div>}</>;
}
