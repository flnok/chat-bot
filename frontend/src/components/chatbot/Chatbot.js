import { useState, useEffect, useRef, createContext } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'universal-cookie';
import Message from './Message';
import Option from './Option';

const cookies = new Cookies();
export const UserContext = createContext();

export default function Chatbot(props) {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  // const messagesEndRef = useRef(null);

  const updateMessages = (msg) => {
    setMessages((currentMessage) => {
      return [...currentMessage, msg];
    });
  };

  if (cookies.get('userID') === undefined) {
    cookies.set('userID', uuidv4(), { path: '/' });
  }

  const queryText = async (text, title = '') => {
    let newMessage = {
      author: 'me',
      msg: { text: { text: text } },
      title,
    };
    updateMessages(newMessage);

    const req = {
      queries: text,
      languageCode: 'vi',
      userId: cookies.get('userID'),
    };

    const res = await axios.post('/api/dialog-flow/query-text', req);
    res.data.fulfillmentMessages.forEach((msg) => {
      newMessage = {
        author: 'bot',
        msg: msg,
      };
      updateMessages(newMessage);
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
      let newMessage = {
        author: 'bot',
        msg: msg,
      };
      updateMessages(newMessage);
    });
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
        <Option
          key={index}
          author={msg.author}
          content={msg.msg.payload}
          queryText={queryText}
          setMessages={setMessages}
        />
      );
    }
  };

  const renderMessages = (messages) => {
    if (messages) {
      return messages.map((message, index) => {
        return renderMessage(message, index);
      });
    }
    return null;
  };

  useEffect(() => {
    async function fetchData() {
      await queryEvent('Welcome');
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  const handleInputMessage = (event) => {
    if (event.key === 'Enter') {
      queryText(event.target.value);
      event.target.value = '';
    }
  };

  const handleButtonMessage = () => {
    queryText(inputRef.current.value);
    inputRef.current.value = '';
  };

  return (
    <UserContext.Provider value={messages}>
      <div className="card chat-bot-container mx-auto">
        <div
          className="card-header text-center p-3 border-bottom-0"
          style={{
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
          }}
        >
          <p className="mb-0 fw-bold">HOBO</p>
        </div>

        <div className="card-body chat-bot">
          {renderMessages(messages)}
          <ScrollToBottom messages={messages} />
        </div>

        <div className="card-footer input-group">
          <input
            type="text"
            autoFocus
            name="inputMessage"
            placeholder="Mình cần đặt bàn..."
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

function ScrollToBottom(props) {
  const elementRef = useRef(null);
  useEffect(() => {
    console.log(elementRef.current);
    elementRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [props.messages]);
  return <div ref={elementRef} />;
}
