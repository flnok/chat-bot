import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessage] = useState([]);

  const onChangeHandler = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <div className="chat-bot-container">
        <div id="chatbot">
          <h2>Chat bot</h2>
          <input
            type="text"
            name="message"
            onChange={onChangeHandler}
            value={messages}
          />
          ;
        </div>
      </div>
    </>
  );
}
