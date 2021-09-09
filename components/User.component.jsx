import styled from 'styled-components';
import CustomAvatar from './CustomAvatar.component';

export default function User({
  user,
  handleFollow,
  followed = [],
  unfollow = false,
  handleUnfollow,
  handleRemoveFollower,
  i,
  remove = false,
}) {
  return (
    <UserCard>
      <LeftContainer>
        <CustomAvatar
          name={user.name[0]}
          width="35px"
          height="35px"
          id={user._id}
        />
        <InfoContainer>
          <div>{user.name}</div>

          {!unfollow && <SmallText>Suggested for you</SmallText>}
        </InfoContainer>
      </LeftContainer>
      {remove ? (
        <Follow onClick={() => handleRemoveFollower(i, user._id)}>
          Remove
        </Follow>
      ) : unfollow ? (
        <Follow onClick={() => handleUnfollow(i, user._id)}>Unfollow</Follow>
      ) : (
        <Follow onClick={() => handleFollow(user._id)}>
          {followed.length > 0 && followed.includes(user._id)
            ? 'Following'
            : 'Follow'}
        </Follow>
      )}
    </UserCard>
  );
}

const UserCard = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 5px;
  width: 100%;
`;
const LeftContainer = styled.div`
  display: flex;
  justify-content: flex-start;

  align-items: center;
  padding: 0frem 5px;
  flex: 1;
`;

const SmallText = styled.div`
  font-size: 0.81rem;
  color: #00000085;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5px;
`;
const Follow = styled.div`
  color: #0c4370;
  cursor: pointer;
`;
