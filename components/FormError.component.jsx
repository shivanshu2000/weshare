import styled from 'styled-components';

export default function FormError({ message: m, resetMessage }) {
  return (
    <ErrorMessage>
      <Message>{m}</Message>
      <Cross onClick={resetMessage}>X</Cross>
    </ErrorMessage>
  );
}

const ErrorMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 11px;
  background-color: rgba(255, 0, 0, 0.5);
  border: 1px solid red;
  width: 100%;
  border-radius: 3px;
`;

const Message = styled.div`
  color: white;
  font-weight: bold;
`;

const Cross = styled.div`
  color: white;
  font-weight: bold;
  cursor: pointer;
`;
