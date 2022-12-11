import axios from 'axios';
import { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context';

export default function CustomAvatar({
  name,
  width = '35px',
  height = '35px',
  id,
  dontShowDetailsModal = false,
}) {
  const [state, setState] = useContext(UserContext);

  const userDetailsModal = async () => {
    setState({ ...state, userDetails: { ...state.userDetails, name: name } });

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API || 'https://weshare-api.onrender.com/api'}/user/${id}`
      );

      const followers = data.followersCount[0].total_followers;
      const following = data.followingCount[0].total_following;
      const posts = data.postsCount;
      setState({
        ...state,
        userDetails: {
          ...state.userDetails,
          user: { followers: followers, following: following, posts: posts },
          openModal: true,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Circle
      onClick={() => {
        if (!dontShowDetailsModal) {
          userDetailsModal();
        }
        return;
      }}
      width={width}
      height={height}
    >
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
  cursor: pointer;
  background-color: #0c437085;
  color: white;
  text-transform: uppercase;
`;
