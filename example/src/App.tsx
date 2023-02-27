import React, { useState, ChangeEventHandler } from "react";
import "./App.css";
import { DiscussionForDev } from "@eten-lab/discussion-box";

function App() {
  const [email, setEmail] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleChangeEmail: ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.target.value);
  };

  const handleLogin = () => {
    setIsLogin(true);
  };

  return (
    <>
      {!isLogin ? (
        <div>
          <input
            type="text"
            value={email}
            onChange={handleChangeEmail}
            placeholder="input your email"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <DiscussionForDev
          tableName="example"
          rowId={1}
          userEmail={email}
          style={{
            height: "calc(100vh - 42px)",
            padding: "20px",
            border: "1px solid #000",
          }}
        />
      )}
    </>
  );
}

export default App;
