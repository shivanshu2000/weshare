import React from 'react';
import styled from 'styled-components';

export default function ModalWrapper({
  children,
  setOpenModal,
  width = '400px',
}) {
  return (
    <>
      <Container onClick={() => setOpenModal(false)}></Container>
      <Modal width={width} className="modal__schedule">
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
  border-radius: 15px;
  top: 50%;
  left: 50%;
  z-index: 200;
  padding: 2rem;
  border: 1px solid #ccc;
  background: white;
  /* opacity: 0; */
  transform: translate(-50%, -50%);
  &.modal__schedule {
    width: ${(props) => props.width};
  }
  @media screen and (max-width: 600px) {
    &.modal__schedule {
      width: 80%;
    }
  }
`;
