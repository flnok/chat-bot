import { useState, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);

  // const onChangeHandler = (event) => {
  //   setMessage(event.target.value);
  // };

  const updateMessages = (msg) => {
    setMessages((previousState) => {
      return [...previousState, msg];
    });
  };
  //eslint-disable-next-line
  const queryText = async (text) => {
    let info = {
      author: 'me',
      msg: { text: { text: text } },
    };

    const req = {
      text,
    };
    updateMessages(info);

    const res = await axios.post('/api/dialog-flow/query-text', req);
    res.data.fulfillmentMessages.forEach((msg) => {
      info = {
        author: 'bot',
        msg: { text: { text: msg } },
      };
      updateMessages(info);
    });
  };
  //eslint-disable-next-line
  const queryEvent = async (event) => {
    const req = {
      queries: event,
      languageCode: 'vi',
      parameters: '',
    };
    const res = await axios.post('/api/dialog-flow/query-event', req);
    console.log(JSON.stringify(res, null, 2));
    res.data.fulfillmentMessages.forEach((msg) => {
      let info = {
        author: 'me',
        msg: msg,
      };
      updateMessages(info);
    });
  };

  const renderMessages = (messages) => {
    return messages
      ? messages.map((message, index) => {
          return (
            <Message
              key={index}
              author={message.author}
              content={message.msg.text.text}
            />
          );
        })
      : null;
  };

  useEffect(() => {
    async function fetchData() {
      await queryEvent('Welcome');
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="chat-bot-container">
      <h2>Chat bot</h2>

      <div className="chat-bot">{renderMessages(messages)}</div>
      <input
        type="text"
        name="message"
        // onChange={onChangeHandler}
        // value={messages}
      />
    </div>
  );
}
