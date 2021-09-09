import styled from 'styled-components';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context';
import { toast } from 'react-toastify';
import Link from 'next/link';
import moment from 'moment';

import { LinkButton, SpinnerContainer } from '../common/styled';
import Posts from '../components/Posts.component';
import Spinner from '../components/Spinner.component';
import axios from 'axios';
import User from '../components/User.component';

import Modal from '../components/Modal.component';
import UserDetails from '../components/UserDetails.component';
import { Button } from './login';
import FormError from '../components/FormError.component';
import CustomAvatar from '../components/CustomAvatar.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [state, setState] = useContext(UserContext);
  const [posts, setPosts] = useState(null);
  const [people, setPeople] = useState(null);
  const [followed, setFollowed] = useState([]);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState({ c: [], postIndex: null });
  const [postId, setPostId] = useState(null);
  const [postIndex, setPostIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const {
    userDetails: { openModal },
  } = state;

  useEffect(() => {
    if (!state.initialized || !state.token) return;
    fetchPosts();
    fetchPeople();
  }, [state.token]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/posts/feed`,
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
      setPosts(data.posts);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        console.log(err);
        toast.error('Something went wrong.');
      }
      setPosts([]);
    }
  };

  const fetchPeople = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/user/people`,
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
      setPeople(data.people);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        console.log(err);
        toast.error('Something went wrong.');
      }
      setPeople([]);
    }
  };

  const handleFollow = async (id) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/user/follow`,
        { id: id },
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      userInfo.user = data.follows;

      window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setState({ ...state, userInfo });

      setFollowed([...followed, id]);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        console.log(err);
        toast.error('Something went wrong.');
      }
    }
  };

  const handleLike = async (id) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/posts/like`,
        { id },
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const handleUnlike = async (id) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/posts/unlike`,
        { id },
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const handleCommentModal = (id, i) => {
    setPostId(id);
    setPostIndex(i);
    setOpenCommentModal(true);
  };

  const handleComment = async () => {
    setError(null);
    setAdding(true);

    if (comment.trim().length === 0) {
      return setError('Enter something to comment');
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/posts/comment`,
        {
          comment,
          id: postId,
        },
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
      setAdding(false);
      console.log(data);
      const newArray = posts;
      newArray.splice(postIndex, 1, data.post);
      setPosts([...newArray]);
      setPostId(null);
      setComment('');
      setOpenCommentModal(false);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Something went wrong');
      }
      setAdding(false);
      setPostId(null);
    }
  };

  const handleDeleteComment = async (cemmentId, postId, postIndex) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/posts/comment`,
        {
          commentId: cemmentId,
          postId: postId,
        },
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );

      const newArray = posts;
      newArray.splice(postIndex, 1, data.post);
      setShowComments(false);
      toast.success('Comment deleted');
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  if (!state.initialized) {
    return (
      <SpinnerContainer>
        <Spinner size="5x" color="#0c4370" />
      </SpinnerContainer>
    );
  }

  const closeModal = (toggle) => {
    setOpenCommentModal(false);
    setComment('');
  };

  const seeComments = (c, i) => {
    setShowComments(true);
    console.log(c, i);
    setComments({ c: c, postIndex: i * 1 });
  };
  // console.log(comments, posts);

  const showDeleteIcon = (a, b) => {
    if (a === b) {
      return true;
    }

    return false;
  };
  return (
    <>
      {state.user ? (
        <Container>
          {showComments && (
            <Modal
              setOpenModal={setShowComments}
              padding="0.5rem"
              height="80%"
              width="80%"
            >
              {comments.c.map((com) => (
                <Comment key={com._id}>
                  <CommentDetails>
                    <CustomAvatar
                      dontShowDetailsModal={true}
                      name={com.postedBy.name[0]}
                    />
                    <div>{com.comment}</div>
                  </CommentDetails>
                  <RightItems>
                    <div>{moment(com.created).fromNow()}</div>
                    {console.log(
                      'dasssssssssss',
                      posts[comments.postIndex],
                      comments.postIndex,
                      posts
                    )}
                    {showDeleteIcon(
                      state.user._id,
                      posts[comments.postIndex].postedBy._id
                    ) || showDeleteIcon(state.user._id, com.postedBy._id) ? (
                      <FontAwesomeIcon
                        color="maroon"
                        style={{ marginLeft: '7px' }}
                        icon={faTrash}
                        onClick={() =>
                          handleDeleteComment(
                            com._id,
                            posts[comments.postIndex],
                            postIndex
                          )
                        }
                      />
                    ) : null}
                  </RightItems>
                </Comment>
              ))}
            </Modal>
          )}
          {openModal && <UserDetails />}
          {openCommentModal && (
            <Modal setOpenModal={closeModal}>
              {error && (
                <FormError
                  resetMessage={() => setError(null)}
                  message={error}
                />
              )}
              <input
                className="raw__input"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter something..."
              />
              <Button onClick={handleComment}>
                {adding ? <Spinner size="1x" color="white" /> : 'Add comment'}
              </Button>
            </Modal>
          )}
          <PostsContainer>
            {!posts ? (
              <SpinnerContainer>
                <Spinner size="3x" />
              </SpinnerContainer>
            ) : posts.length > 0 ? (
              <Posts
                seeComments={seeComments}
                handleCommentModal={handleCommentModal}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
                posts={posts}
                home={true}
                edit={false}
              />
            ) : (
              <SpinnerContainer>No posts.</SpinnerContainer>
            )}
          </PostsContainer>

          <UsersContainer>
            {!people ? (
              <SpinnerContainer>
                <Spinner size="3x" />
              </SpinnerContainer>
            ) : people.length > 0 ? (
              <>
                {people.map((user, i) => (
                  <User
                    followed={followed}
                    user={user}
                    key={user._id}
                    i={i}
                    handleFollow={handleFollow}
                  />
                ))}
              </>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '1.9rem' }}>
                <div style={{ fontSize: '1.3rem' }}>No suggestions.</div>
                <LinkButton>
                  <Link href="/dashboard">Go to profile</Link>
                </LinkButton>
              </div>
            )}
          </UsersContainer>
        </Container>
      ) : (
        <Welcome>
          <div>Log in to see the feed</div>
          <Link href="/login">Log in</Link>
        </Welcome>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  padding: 2.5rem 1rem;
  place-items: start normal;
  grid-template-columns: 7fr 4fr;
  grid-gap: 1rem 2rem;

  @media only screen and (max-width: 490px) {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-start;
  }
`;
const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* align-items: center; */
`;
const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  position: sticky;
  top: 15px;
  height: 400px;
  overflow-y: scroll;
  margin-top: 1rem;
  /* padding-right: 1rem; */
  @media only screen and (max-width: 490px) {
    position: unset;
    width: 100%;
    height: 200px;
    display: flex;
    flex-wrap: nowrap;
    overflow-y: scroll;
  }

  &::-webkit-scrollbar {
    /* height: 6px; */
    width: 1px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px transparent;
    border-radius: 10px;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb {
    background: #0c4370;
    border-radius: 10px;
  }
`;

const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 3.5rem;

  & > div {
    font-size: 2.5rem;
    color: #0c4370;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  & > a {
    border: 2.5px solid #0c4370;
    padding: 0.3rem 0.9rem;
    border-radius: 7px;
    font-size: 1.3rem;
    font-weight: bold;
    color: #0c4370;
  }
`;

const Comment = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.7rem 0;
`;

const CommentDetails = styled.div`
  flex: 1;
  display: grid;
  place-items: center start;
  grid-template-columns: 1fr 15fr;
  & > div {
    margin: 0 5px;
  }
`;

const RightItems = styled.div`
  display: flex;
  align-items: center;
  @media only screen and (max-width: 380px) {
    & > div {
      display: none;
    }
  }
`;
