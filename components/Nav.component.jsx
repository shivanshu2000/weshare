import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { useContext } from 'react';
import { UserContext } from '../context';

export default function Navbar() {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  const logout = () => {
    window.localStorage.removeItem('userInfo');
    setState({ ...state, user: null, token: null });
    router.push('/login');
  };
  return (
    <NavWrapper>
      <Nav>
        <Link href="/" className="left-link">
          Feed
        </Link>
        <Link href="/dashboard" className="left-link">
          Dashboard
        </Link>
        <RightItems>
          {state.token ? (
            <button onClick={logout} type="button">
              Logout
            </button>
          ) : (
            <>
              {' '}
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          )}
        </RightItems>
      </Nav>
    </NavWrapper>
  );
}

const NavWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: black; */
`;

const Nav = styled.div`
  display: flex;
  width: 100%;
  padding: 0.7rem 1rem;
  justify-content: space-between;
  align-items: center;
  background-color: #0c4370;
  box-sizing: border-box;

  & > a {
    text-decoration: none;
    cursor: pointer;
    color: white;
    font-size: 1rem;
    margin: 0 9px;
    font-weight: bold;
    letter-spacing: 1px;
  }
`;

const RightItems = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > a {
    text-decoration: none;
    padding: 5px 11px;
    margin: 0 3px;
    cursor: pointer;
    background-color: white;
    color: black;
    border-radius: 5px;
  }
  & > button {
    outline: none;
    border: none;
    padding: 5px 11px;
    margin: 0 3px;
    cursor: pointer;
    background-color: white;
    color: black;
    border-radius: 5px;
  }
`;
