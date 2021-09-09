import styled from 'styled-components';

export const Avatar = styled.img`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
`;
