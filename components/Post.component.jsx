import styled from 'styled-components';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  faThumbsUp as farThumbsUp,
  faComment as farComment,
  faAngry,
} from '@fortawesome/free-regular-svg-icons';

import CustomAvatar from './CustomAvatar.component';

export default function Post({
  post,
  i,
  setOpenEditModal,
  handleEditPostData,
  handleDeletePost,
  edit = true,
}) {
  const Container = edit ? Card : HomeCard;

  return (
    <Container>
      <TopContainer>
        <div
          style={{
            display: 'flex',
            justifContent: 'center',
            alignItems: 'center',
          }}
        >
          <CustomAvatar name={post.postedBy.name[0]} />
          <div style={{ marginLeft: '7px' }}>{post.postedBy.name}</div>
        </div>
        <div>{moment(post.createdAt).fromNow()}</div>
      </TopContainer>

      <MiddleContainer height={!edit ? '300px' : '235px'}>
        <Content>{renderHTML(post.content)}</Content>
        {post.image.url && (
          <Image
            style={{
              backgroundImage: 'url(' + post.image.url + ')',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
            height={!edit ? '350px' : '210px'}
          />
        )}
      </MiddleContainer>

      <BottomContainer>
        <div>
          <FontAwesomeIcon icon={farThumbsUp} />
          <FontAwesomeIcon icon={farComment} />
        </div>
        {edit && (
          <div>
            <FontAwesomeIcon
              onClick={() => {
                setOpenEditModal(true);
                handleEditPostData(i);
              }}
              icon={faEdit}
            />
            <FontAwesomeIcon
              onClick={() => handleDeletePost(post._id)}
              icon={faTrash}
            />
          </div>
        )}
      </BottomContainer>
    </Container>
  );
}

const HomeCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 1rem auto;
  min-height: 250px;
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  min-height: 250px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (max-width: 1240px) {
    width: 250px;
  }
  @media only screen and (max-width: 1040px) {
    width: 225px;
    min-height: 250px;
  }

  @media only screen and (max-width: 935px) {
    width: 270px;
    min-height: 300px;
  }
  @media only screen and (max-width: 840px) {
    width: 215px;
    min-height: 250px;
  }

  @media only screen and (max-width: 670px) {
    width: 100%;
    min-height: 250px;
  }
`;

const TopContainer = styled.div`
  padding: 0.5rem 0.3rem;
  /* max-width: 300px; */
  background-color: #0c437010;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MiddleContainer = styled.div`
  max-height: ${(props) => props.height};
  overflow-y: scroll;
  padding-left: 1px;

  &::-webkit-scrollbar {
    height: 6px;
    width: 1px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px transparent;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #0c4370;
    border-radius: 10px;
  }
`;

const Image = styled.div`
  height: ${(props) => props.height};
  width: 100%;
  /* 
  object-fit: cover;
  object-position: center center;
  margin: 0;
  padding: 0; */
`;

const Content = styled.div`
  margin-top: 5px;
  padding: 3px;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 0.3rem;
  margin-top: auto;
  background-color: #0c437010;
  & > div > svg {
    margin: 0 7px;
    color: #0c4370;
  }
`;
