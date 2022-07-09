import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Message from './Message';
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';

const cookies = new Cookies();

export default function Chatbot(props) {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);

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
    updateMessages(info);

    const req = {
      queries: text,
      languageCode: 'vi',
      userId: cookies.get('userID'),
    };

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
          return message.msg?.text?.text ? (
            <Message
              key={index}
              author={message.author}
              content={message.msg.text.text}
            />
          ) : (
            <h2 key={index}>Nothing</h2>
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

  const handleInputMessage = useCallback((event) => {
    if (event.key === 'Enter') {
      queryText(event.target.value);
      event.target.value = '';
    }
    // eslint-disable-next-line
  }, []);

  const handleButtonMessage = useCallback(() => {
    queryText(inputRef.current.value);
    inputRef.current.value = '';
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="card chat-bot-container"
      style={{
        borderRadius: '15px',
      }}
    >
      <div
        className="card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
        style={{
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
        }}
      >
        <p className="mb-0 fw-bold">ChatBot</p>
      </div>
      <div className="card-body chat-bot">{renderMessages(messages)}</div>
      <div className="input-group mb-1 card-footer">
        <input
          type="text"
          autoFocus
          name="inputMessage"
          placeholder="Chat ở đây"
          ref={inputRef}
          onKeyUp={handleInputMessage}
          className="form-control"
        />

        <button onClick={handleButtonMessage} className="input-group-text">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}
