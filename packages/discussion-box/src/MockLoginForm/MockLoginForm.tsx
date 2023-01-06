import React, { useState, useEffect, ChangeEventHandler } from 'react';
import { useMutation } from '@apollo/client';
import { discussionClient } from '../graphql/discussionGraphql';
import { CREATE_USER } from '../graphql/discussionQuery';

type MockLoginFormProps = {
  setMockUserInfo(info: { userInfo: unknown; userInfoType: string }): void;
};

export function MockLoginForm({ setMockUserInfo }: MockLoginFormProps) {
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [createUser, { loading, error, data }] = useMutation(CREATE_USER, {
    client: discussionClient,
  });

  useEffect(() => {
    if (loading === false && error === undefined && data) {
      setMockUserInfo({
        userInfo: data.createUser.user_id,
        userInfoType: 'user_id',
      });
    }
  }, [data, loading, error, setMockUserInfo]);

  const handleChangeUserId: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUserId(+e.target.value);
  };

  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUsername(e.target.value);
  };

  const handleRegister = () => {
    if (username.trim() === '' || email.trim() === '') {
      alert('Please input both Username and Email');
      return;
    }

    createUser({
      variables: {
        email,
        username,
      },
    });
  };

  const handleLogin = () => {
    if (userId) {
      setMockUserInfo({
        userInfo: userId,
        userInfoType: 'user_id',
      });
      return;
    }

    if (username.trim() !== '') {
      setMockUserInfo({
        userInfo: username.trim(),
        userInfoType: 'name',
      });
      return;
    }

    if (email.trim() !== '') {
      setMockUserInfo({
        userInfo: email.trim(),
        userInfoType: 'email',
      });
    }

    alert('Please input user info!!');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
      }}
    >
      <input
        type="number"
        value={userId ? userId : ''}
        onChange={handleChangeUserId}
        placeholder="User Id"
      />
      <input value={email} onChange={handleEmailChange} placeholder="Email" />
      <input
        value={username}
        onChange={handleUsernameChange}
        placeholder="Username"
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
