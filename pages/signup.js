import { useState, useContext } from 'react';
import { Form, Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import { UserContext } from '../context';
import TextInput from '../components/TextInput.component';
import { Button, Layout, Wrapper } from './login';
import FormErrorMessage from '../components/FormError.component';

export default function Signup() {
  const [formError, setFormError] = useState(null);
  const [signing, setSigning] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your email'),
    name: Yup.string().required('Please enter your name'),
    password: Yup.string()
      .min(5, 'Password must be at least 5 characters long')
      .required('Please enter a password'),
  });

  const resetMessage = () => {
    setFormError(null);
  };

  const handleSignup = async ({ name, email, password, confirmPassword }) => {
    setSigning(true);
    setFormError(null);
    try {
      const res = await axios.post(
        `https://weshare-api.onrender.com/user/signup`,
        {
          name,
          email,
          password,
          confirmPassword,
        }
      );
      setSigning(false);
      console.log(res);
      if (res.data.success) {
        router.push('/login');
      }
    } catch (err) {
      console.log(err);
      setFormError(err.response.data.error);
      if (err.response) {
        setSigning(false);
      } else {
        setSigning(false);
      }
    }
  };
  if (state.token) {
    router.push('/');
  }
  if (!state.initialized) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!state.token && (
        <Layout>
          <Wrapper>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
              }}
              onSubmit={async (data, { setSubmitting, resetForm }) => {
                console.log(data);
                await handleSignup(data);
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
                    label="Name:"
                    name="name"
                    placeholder="Enter your name"
                  />
                  <div style={{ marginTop: '1.9rem' }} />
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
                  <div style={{ marginTop: '1.9rem' }} />
                  <TextInput
                    label="Confirm Password:"
                    name="confirmPassword"
                    type="password"
                    autoComplete="off"
                    placeholder="Re-enter the password"
                  />

                  {signing ? (
                    <Button type="button">Please wait...</Button>
                  ) : (
                    <Button
                      style={{
                        backgroundColor:
                          !dirty || !isValid ? '#ccc' : '#0C4370',
                      }}
                      disabled={!dirty || !isValid}
                      type="submit"
                    >
                      Sign up
                    </Button>
                  )}
                </Form>
              )}
            </Formik>
            <p style={{ marginTop: '9px', textAlign: 'center' }}>
              Already have an account? <Link href="/login">Login here!</Link>
            </p>
          </Wrapper>
        </Layout>
      )}
    </>
  );
}
