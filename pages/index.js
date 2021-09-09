import styled from 'styled-components';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context';
import { toast } from 'react-toastify';
import Link from 'next/link';

import { SpinnerContainer } from '../common/styled';
import Posts from '../components/Posts.component';
import Spinner from '../components/Spinner.component';
import axios from 'axios';
import User from '../components/User.component';

export default function Home() {
  const [state, setState] = useContext(UserContext);
  const [posts, setPosts] = useState(null);
  const [people, setPeople] = useState(null);
  const [followed, setFollowed] = useState([]);

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
      console.log(data);
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      userInfo.user = data.follows;

      console.log(userInfo);

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

  if (!state.initialized) {
    return (
      <SpinnerContainer>
        <Spinner size="5x" color="#0c4370" />
      </SpinnerContainer>
    );
  }

  return (
    <>
      {state.user ? (
        <Container>
          <PostsContainer>
            {!posts ? (
              <SpinnerContainer>
                <Spinner size="3x" />
              </SpinnerContainer>
            ) : posts.length > 0 ? (
              <Posts posts={posts} home={true} edit={false} />
            ) : (
              <SpinnerContainer>No suggestions.</SpinnerContainer>
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
              <SpinnerContainer>No users yet.</SpinnerContainer>
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
`;
const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 11px;
  position: sticky;
  top: 15px;
  height: 400px;
  overflow-y: scroll;
  margin-top: 1rem;

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
