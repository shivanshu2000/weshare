import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import Link from 'next/link';
import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import { UserContext } from '../context';
import TextInput from '../components/TextInput.component';
import FormErrorMessage from '../components/FormError.component';
import { useRouter } from 'next/router';

export default function Login() {
  const [formError, setFormError] = useState(null);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter email'),
    password: Yup.string().required('Please enter a password'),
  });

  const resetMessage = () => {
    setFormError(null);
  };
  const handleLogin = async ({ email, password }) => {
    setFormError(null);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API || 'https://weshare-api.onrender.com/api'}/user/login`,
        {
          email,
          password,
        }
      );
      setState({ ...state, user: data.user, token: data.token });
      window.localStorage.setItem('userInfo', JSON.stringify(data));
      router.push('/');
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        setFormError(error.response.data.error);
      } else {
        setFormError('Something went wrong');
      }
    }
  };

  if (!state.initialized) {
    return <div>Loading...</div>;
  }
  if (state.token) {
    console.log(state.token, 'state.token in login');
    router.push('/');
  }

  return (
    <>
      {!state.token && (
        <Layout>
          <Wrapper>
            <Formik
              validationSchema={validationSchema}
              initialValues={{ email: '', password: '' }}
              onSubmit={async (data, { setSubmitting, resetForm }) => {
                await handleLogin(data);
              }}
            >
              {({ isSubmitting, dirty, isValid }) => (
                <Form>
                  {formError && (
                    <FormErrorMessage
                      message={formError}
                      resetMessage={resetMessage}
                    />
                  )}
                  <TextInput
                    label="Email:"
                    name="email"
                    placeholder="Enter your email"
                  />

                  <div style={{ marginTop: '1.9rem' }} />

                  <TextInput
                    label="Password:"
                    name="password"
                    type="password"
                    autoComplete="off"
                    placeholder="Enter your password"
                  />

                  <Button
                    style={{
                      backgroundColor: !isValid ? '#ccc' : '#0C4370',
                    }}
                    disabled={!isValid}
                    type="submit"
                  >
                    Sign in
                  </Button>
                </Form>
              )}
            </Formik>
            <p style={{ marginTop: '9px', textAlign: 'center' }}>
              Haven't registered yet? <Link href="/signup">Register here!</Link>
            </p>
          </Wrapper>
        </Layout>
      )}
    </>
  );
}

export const Layout = styled.div`
  width: 100%;
  padding: 2.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 3.3rem);
`;

export const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 400px;
  padding: 2rem 1.5rem;
  border: 1px solid #ccc;
  border-radius: 7px;

  & > form {
    width: 100%;
  }
`;

export const Button = styled.button`
  color: white;
  text-transform: uppercase;
  border-radius: 7px;
  border: none;
  width: 100%;
  display: block;
  padding: 9px 1.5rem;
  background-color: #0c4370;
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0 auto;
  margin-top: 2rem;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;
