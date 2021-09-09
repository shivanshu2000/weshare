import styled from 'styled-components';
import Post from './Post.component';

export default function Posts({
  posts,
  handleDeletePost,
  setOpenEditModal,
  handleEditPostData,
  home = false,
  edit,
}) {
  return (
    <>
      {home ? (
        <HomeContainer>
          {posts.map((post, i) => (
            <Post
              key={post._id}
              post={post}
              i={i}
              handleDeletePost={handleDeletePost}
              handleEditPostData={handleEditPostData}
              setOpenEditModal={setOpenEditModal}
              edit={edit}
            />
          ))}
        </HomeContainer>
      ) : (
        <Container>
          {posts.map((post, i) => (
            <Post
              key={post._id}
              post={post}
              i={i}
              handleDeletePost={handleDeletePost}
              handleEditPostData={handleEditPostData}
              setOpenEditModal={setOpenEditModal}
            />
          ))}
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  place-items: start center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 1rem 0rem;
  padding: 2rem 0.5rem;

  @media only screen and (max-width: 935px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media only screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem 1rem;
  }
  @media only screen and (max-width: 520px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    & > div {
      margin-bottom: 1.5rem;
      grid-gap: 1rem 0rem;
    }
  }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
