import { useContext } from 'react';
import { UserContext } from '../context';
import { Sidebar, SingleInfo, Title } from '../pages/dashboard';
import Modal from './Modal.component';

export default function UserDetails() {
  const [state, setState] = useContext(UserContext);

  const closeModal = (toggle) => {
    setState({
      ...state,
      userDetails: { ...state.userDetails, openModal: false },
    });
  };

  const {
    userDetails: { user, name },
  } = state;

  return (
    <Modal setOpenModal={closeModal}>
      <Sidebar style={{ border: 'none' }}>
        <SingleInfo>
          <Title>Total posts</Title>
          <div>{user.posts}</div>
        </SingleInfo>
        <SingleInfo>
          <Title>Followers</Title>
          <div>{user.followers}</div>
        </SingleInfo>
        <SingleInfo>
          <Title>Following</Title>
          <div>{user.following}</div>
        </SingleInfo>
      </Sidebar>
    </Modal>
  );
}
