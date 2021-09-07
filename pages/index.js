import styled from 'styled-components';
import { useContext } from 'react';
import { UserContext } from '../context';

export default function Home() {
  const [state, setState] = useContext(UserContext);

  if (!state.initialized) {
    return <div>Loading...</div>;
  }

  return <Title>Home</Title>;
}

const Title = styled.div`
  font-size: 2rem;
  color: green;
`;
