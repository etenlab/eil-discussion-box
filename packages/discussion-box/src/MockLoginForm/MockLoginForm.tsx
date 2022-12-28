import React, { useState, useEffect, ChangeEventHandler } from "react";
import { useMutation } from "@apollo/client";
import { discussionClient } from "../graphql/discussionGraphql";
import { CREATE_USER } from "../graphql/discussionQuery";

type MockLoginFormProps = {
  setMockUserId(id: number): void;
};

export function MockLoginForm({ setMockUserId }: MockLoginFormProps) {
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [createUser, { loading, error, data }] = useMutation(CREATE_USER, {
    client: discussionClient,
  });

  useEffect(() => {
    if (loading === false && error === undefined && data) {
      setMockUserId(data.createUser.user_id);
    }
  }, [data, loading, error, setMockUserId]);

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
    if (username.trim() === "" || email.trim() === "") {
      alert("Please input both Username and Email");
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
    if (!userId) {
      alert("Please input userId");
      return;
    }

    setMockUserId(userId);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "300px",
      }}
    >
      <input
        type="number"
        value={userId ? userId : ""}
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
