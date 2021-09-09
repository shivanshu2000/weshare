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

export const LinkButton = styled.div`
  margin-top: 1.5rem;
  & > a {
    border: 2.5px solid #0c4370;
    padding: 0.3rem 0.9rem;
    border-radius: 7px;
    font-size: 1.3rem;
    font-weight: bold;
    color: #0c4370;
  }
`;
