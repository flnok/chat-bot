import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Message from './Message';
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';

const cookies = new Cookies();

export default function Chatbot() {
  const [messages, setMessages] = useState([]);

  const updateMessages = (msg) => {
    setMessages((previousState) => {
      return [...previousState, msg];
    });
  };

  if (cookies.get('userID') === undefined) {
    cookies.set('userID', uuidv4(), { path: '/' });
  }

  //eslint-disable-next-line
  const queryText = async (text) => {
    let info = {
      author: 'me',
      msg: { text: { text: text } },
    };

    const req = {
      queries: text,
      languageCode: 'vi',
      userId: cookies.get('userID'),
    };
    updateMessages(info);

    const res = await axios.post('/api/dialog-flow/query-text', req);
    res.data.fulfillmentMessages.forEach((msg) => {
      info = {
        author: 'bot',
        msg: msg,
      };
      updateMessages(info);
    });
  };
  //eslint-disable-next-line
  const queryEvent = async (event) => {
    const req = {
      queries: event,
      languageCode: 'vi',
      userId: cookies.get('userID'),
    };
    const res = await axios.post('/api/dialog-flow/query-event', req);
    res.data.fulfillmentMessages.forEach((msg) => {
      let info = {
        author: 'bot',
        msg: msg,
      };
      updateMessages(info);
    });
  };

  const renderMessages = (messages) => {
    return messages
      ? messages.map((message, index) => {
          // if (message?.msg?.text?.text) {
          return (
            <Message
              key={index}
              author={message.author}
              content={message.msg.text.text}
            />
          );
          // }
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

  const handleInputMessage = useCallback((event) => {
    if (event.key === 'Enter') {
      queryText(event.target.value);
      event.target.value = '';
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="chat-bot-container">
      <h2>Chat bot</h2>
      <div className="chat-bot">{renderMessages(messages)}</div>
      <input
        autoFocus
        type="text"
        name="inputMessage"
        onKeyUp={handleInputMessage}
      />
    </div>
  );
}
