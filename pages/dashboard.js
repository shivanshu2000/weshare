import PrivateRoute from '../components/PrivateRoute';
import { useRouter } from 'next/router';
import { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Button } from './login';
import FormErrorMessage from '../components/FormError.component';
import { UserContext } from '../context';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner.component';
import Posts from '../components/Posts.component';
import Modal from '../components/Modal.component';
import { SpinnerContainer } from '../common/styled';
import User from '../components/User.component';

export default function Dashboard() {
  const [formError, setFormError] = useState(null);
  const [state, setState] = useContext(UserContext);

  const [editContent, setEditContent] = useState(null);
  const [editing, setEditing] = useState(false);

  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingPost, setUploadingPost] = useState(false);

  const [image, setImage] = useState(null);

  const [posts, setPosts] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);

  const [run, setRun] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);

  useEffect(() => {
    if (!state.initialized || !state.token) return;
    getPosts();
  }, [state.token, run]);

  const handleEditPostData = (i) => {
    console.log(posts[i]);
    const post = posts[i];

    setEditContent({ id: post._id, content: post.content });
  };
  const getPosts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/posts`, {
        headers: {
          authorization: `Bearer ${state.token}`,
        },
      });
      setPosts(data.posts);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Something went wrong.');
      }
    }
  };
  const handleEditPost = async () => {
    setEditing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/posts`,
        {
          id: editContent.id,
          content: editContent.content,
        },
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
      setEditing(false);
      setOpenEditModal(false);
      toast.success('Post edited successfully');

      setRun(!run);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Something went wrong.');
      }
      setEditing(false);
    }
  };
  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API}/posts/${id}`, {
        headers: {
          authorization: `Bearer ${state.token}`,
        },
      });
      toast.success('Post deleted successfully');
      setRun(!run);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Something went wrong.');
      }
    }
  };

  const handlePost = async () => {
    if (!image && content.length === 0) {
      return setFormError('Submit either a photo or caption');
    }
    setUploadingPost(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/posts`,
        {
          content: content,
          image: {
            url: image ? image.url : null,
            public_id: image ? image.public_id : null,
          },
        },
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );

      setUploadingPost(false);
      setContent(null);
      setImage(null);
      setRun(!run);
      toast.success('Post uploaded');
    } catch (err) {
      if (err.response) {
        setFormError(err.response.data.error);
      } else {
        console.log(err);
        setFormError('Something went wrong');
      }
      setUploadingPost(false);
      setContent(null);
    }
  };

  const handleImage = async (e) => {
    setImage(null);
    setUploading(true);
    const file = e.target.files[0];

    if (!file) {
      return setFormError('Please select an image');
    }

    let formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/posts/upload-image`,
        formData,
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
      setImage({ url: data.url, public_id: data.public_id });
      setUploading(false);
    } catch (err) {
      if (err.response) {
        const error = err.response.data.error;
        if (error.includes('maxFileSize exceeded')) {
          setFormError('File size limit exceeded');
        } else {
          setFormError(error);
        }
      } else {
        setFormError('Something went wrong. Please select an image.');
      }
      setUploading(false);
    }
  };

  const getFollowers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/user/followers`,
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
      setFollowers(data.followers);
      openFollowersModal(true);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Something went wrong.');
      }
      setUploading(false);
    }
  };
  const getFollowing = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/user/following`,
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
      setFollowing(data.following);
      setOpenFollowingModal(true);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        console.log(err);
        toast.error('Something went wrong.');
      }
      setUploading(false);
    }
  };

  const handleUnfollow = async (i, id) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/user/unfollow`,
        { id: id },
        {
          headers: {
            authorization: `Bearer ${state.token}`,
          },
        }
      );
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      userInfo.user = data.user;

      window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setState({ ...state, userInfo });

      const users = following;

      users.splice(i, 1);

      setFollowers([...users]);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        console.log(err);
        toast.error('Something went wrong.');
      }
      setUploading(false);
    }
  };

  return (
    <PrivateRoute>
      {openFollowersModal && (
        <Modal width="600px" setOpenModal={setOpenFollowersModal}>
          {followers.map((user) => (
            <User user={user} key={user._id} />
          ))}
        </Modal>
      )}
      {openFollowingModal && (
        <Modal
          width="600px"
          height={following.length > 0 ? '80%' : '250px'}
          padding="0.5rem"
          setOpenModal={setOpenFollowingModal}
        >
          {following.length > 0 ? (
            <>
              {following.map((user, i) => (
                <User
                  i={i}
                  handleUnfollow={handleUnfollow}
                  unfollow={true}
                  user={user}
                  key={user._id}
                />
              ))}
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              You have no followers.
            </div>
          )}
        </Modal>
      )}

      {openEditModal && (
        <Modal width="600px" setOpenModal={setOpenEditModal}>
          <ReactQuill
            value={editContent.content}
            theme="snow"
            onChange={(e) => {
              setEditContent({ ...editContent, content: e });
            }}
          />

          <Button onClick={handleEditPost}>
            {editing ? <Spinner color="#fff" size="1x" /> : 'Edit'}
          </Button>
        </Modal>
      )}
      {formError && (
        <FormErrorMessage
          message={formError}
          resetMessage={() => setFormError(null)}
        />
      )}
      <Container>
        <AddPostContainer>
          <div
            style={{
              width: '100%',
              height: '50%',
            }}
          >
            <ReactQuill
              style={{
                width: '100%',
                height: '100%',
              }}
              value={content}
              placeholder="Enter something..."
              theme="snow"
              onChange={(e) => {
                setContent(e);
              }}
            />
          </div>
          <ButtonContainer>
            <Button onClick={handlePost}>
              {uploadingPost ? <Spinner color="#fff" size="1x" /> : 'Post'}
            </Button>

            {image ? (
              <img
                src={image.url}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : uploading ? (
              <Spinner color="#0c4370" size="3x" />
            ) : (
              <label>
                <FontAwesomeIcon icon={faCamera} size="3x" />

                <input
                  onChange={handleImage}
                  type="file"
                  accept="images/*"
                  hidden
                />
              </label>
            )}
          </ButtonContainer>
        </AddPostContainer>
        <Sidebar>
          <SingleInfo>
            <Title>Total posts</Title>
            <div></div>
          </SingleInfo>
          <SingleInfo onClick={getFollowers}>
            <Title>Followers</Title>
            <div></div>
          </SingleInfo>
          <SingleInfo onClick={getFollowing}>
            <Title>Following</Title>
            <div></div>
          </SingleInfo>
        </Sidebar>
      </Container>

      {!posts ? (
        <SpinnerContainer>
          <Spinner size="3x" />
        </SpinnerContainer>
      ) : posts.length > 0 ? (
        <Posts
          handleEditPostData={handleEditPostData}
          posts={posts}
          setOpenEditModal={setOpenEditModal}
          handleDeletePost={handleDeletePost}
        />
      ) : (
        'No posts yet'
      )}
    </PrivateRoute>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 5fr 2fr;
  grid-gap: 1rem 3rem;
  margin-top: 1.5rem;
  padding: 0 1.5rem;
  @media only screen and (max-width: 616px) {
    grid-template-columns: 7fr 2fr;
  }
  @media only screen and (max-width: 616px) {
    display: flex;
    flex-direction: column;
  }
  @media only screen and (max-width: 179px) {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  box-sizing: border-box;
  margin-top: 35px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 2rem;
  & > button {
    width: 25%;
    margin-bottom: 15px;
    /* margin-left: 15px; */
    margin: 0;
    margin-right: auto;
    border-radius: 7px;
  }

  & > label > svg {
    color: #0c4370;
    cursor: pointer;
  }
`;

const AddPostContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 200px;

  @media only screen and (max-width: 410px) {
    height: 350px;
    & > ${ButtonContainer} > button {
      flex: 1;
      margin-right: 11px;
    }
  }
  @media only screen and (max-width: 305px) {
    height: 350px;
    & > ${ButtonContainer} {
      height: 200px;
      align-items: center;
    }
  }
  @media only screen and (max-width: 249px) {
    & > ${ButtonContainer} {
      flex-direction: column;
      justify-content: flex-end;
    }
    & > ${ButtonContainer} > button {
      flex: 0;
      width: 100%;
      margin: 11px 0;
    }
    & > ${ButtonContainer} > label > svg {
      display: none;
    }
  }
`;

const Sidebar = styled.div`
  max-height: 250px;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid #ccc;
  border-radius: 7px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    height: 6px;
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #f2f2f2;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: black;
    border-radius: 10px;
  }
`;

const SingleInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70px;
  border-radius: 1.5px;
  margin: 5px 13px;
  padding: 1rem 0.5rem;
  cursor: pointer;
  & > div {
    margin: 3px 0;
  }
`;

const Title = styled.div`
  color: #0c4370;
  font-size: 1.1rem;
  font-weight: bold;
`;
