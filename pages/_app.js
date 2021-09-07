import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

import '../public/global.css';
import Navbar from '../components/Nav.component';
import { UserProvider } from '../context';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <UserProvider>
        <Navbar />
        <ToastContainer position="top-center" />
        <AppWrapper>
          <Component {...pageProps} />
        </AppWrapper>
      </UserProvider>
    </>
  );
}

const AppWrapper = styled.div`
  min-height: calc(100vh - 3.3rem);
`;

export default MyApp;
