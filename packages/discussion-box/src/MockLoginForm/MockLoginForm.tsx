import React, { useState, useEffect, ChangeEventHandler } from 'react';
import { useMutation } from '@apollo/client';
import { discussionClient } from '../graphql/discussionGraphql';
import { CREATE_USER } from '../graphql/discussionQuery';

type MockLoginFormProps = {
  mockUserId: number | null;
  setMockUserId(id: number): void;
};

export function MockLoginForm({
  mockUserId,
  setMockUserId,
}: MockLoginFormProps) {
  const [email, setEmail] = useState<string>('');
  const [createUser, { loading, error, data }] = useMutation(CREATE_USER, {
    client: discussionClient,
  });

  useEffect(() => {
    if (loading === false && error === undefined && data) {
      setMockUserId(data.createUser.user_id);
    }
  }, [data, loading, error, setMockUserId]);

  const handleMockUserIdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setMockUserId(+e.target.value);
  };

  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
  };

  const handleRegister = () => {
    createUser({
      variables: {
        email,
      },
    });
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
        value={mockUserId ? mockUserId : ''}
        onChange={handleMockUserIdChange}
        placeholder="User Id"
      />
      <input value={email} onChange={handleEmailChange} placeholder="Email" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
