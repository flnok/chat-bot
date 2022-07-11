import { useState, useEffect, useRef, createContext } from 'react';
import axios from 'axios';
import Message from './Message';
import Option from './Option';
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';

const cookies = new Cookies();
export const UserContext = createContext();

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

  const queryText = async (text, title = '') => {
    let info = {
      author: 'me',
      msg: { text: { text: text } },
      title,
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

  const renderOptions = (options) => {
    return options.map((opt, index) => (
      <Option
        key={index}
        content={opt}
        queryText={queryText}
        messages={messages}
        setMessages={setMessages}
      ></Option>
    ));
  };

  const renderMessage = (msg, index) => {
    if (msg.msg?.text?.text) {
      return (
        <Message
          key={index}
          author={msg.author}
          content={msg.msg.text.text}
          title={msg.title}
        />
      );
    } else if (msg.msg?.payload) {
      return (
        <div key={index}>
          <div className="d-flex flex-row justify-content-start mb-4">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
              alt="avatar 1"
              style={{
                width: '45px',
                height: '100%',
              }}
            />
            <div
              className="p-3 ms-3"
              style={{
                borderRadius: '15px',
                backgroundColor: 'rgba(57, 192, 237,.2)',
              }}
            >
              <div className="option-content">
                {renderOptions(
                  msg.msg.payload.fields.richContent.listValue.values[0]
                    .listValue.values
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderMessages = (messages) => {
    return messages
      ? messages.map((message, index) => {
          return renderMessage(message, index);
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

  const handleInputMessage = async (event) => {
    if (event.key === 'Enter') {
      await queryText(event.target.value);
      event.target.value = '';
    }
  };

  const handleButtonMessage = async () => {
    await queryText(inputRef.current.value);
    inputRef.current.value = '';
  };

  return (
    <UserContext.Provider value={messages}>
      <div
        className="card chat-bot-container mx-auto"
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
    </UserContext.Provider>
  );
}
