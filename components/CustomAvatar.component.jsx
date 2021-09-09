import styled from 'styled-components';

export default function CustomAvatar({
  name,
  width = '35px',
  height = '35px',
}) {
  return (
    <Circle width={width} height={height}>
      {name}
    </Circle>
  );
}

const Circle = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0c437085;
  color: white;
  text-transform: uppercase;
`;
