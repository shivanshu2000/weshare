import React from 'react';
import styled from 'styled-components';

export default function ModalWrapper({
  children,
  setOpenModal,
  width = '400px',
  height = 'auto',
  padding = '2rem',
}) {
  return (
    <>
      <Container onClick={() => setOpenModal(false)}></Container>
      <Modal
        width={width}
        height={height}
        padding={padding}
        className="modal__schedule"
      >
        {children}
      </Modal>
    </>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgb(0, 0, 0, 0.8);
`;

const Modal = styled.div`
  position: fixed;
  border-radius: 7px;
  top: 50%;
  left: 50%;
  z-index: 200;
  padding: ${(props) => props.padding};
  border: 1px solid #ccc;
  overflow-y: scroll;
  background: white;
  /* opacity: 0; */
  transform: translate(-50%, -50%);
  &::-webkit-scrollbar {
    height: 0px;
    width: 0px;
  }

  &.modal__schedule {
    width: ${(props) => props.width};
    height: ${(props) => props.height};
  }
  @media screen and (max-width: 600px) {
    &.modal__schedule {
      width: 80%;
    }
  }
`;
