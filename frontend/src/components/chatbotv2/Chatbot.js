import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';
import Chips from './Chips';
import Message from './Message';
import Option from './Option';

const cookies = new Cookies();

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [sessionIntent, setSessionIntent] = useState(null);
  const inputRef = useRef(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const elementRef = useRef(null);

  if (cookies.get('userID') === undefined) {
    cookies.set('userID', uuidv4(), { path: '/' });
  }

  useEffect(() => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    async function fetchData() {
      await queryEvent('welcome');
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, [messages]);

  const updateMessages = (msg) => {
    setMessages((currentMessage) => {
      return [...currentMessage, msg];
    });
  };

  const getSessionIntent = () => {
    console.log({ sessionIntent });
    const si = {
      contexts: sessionIntent?.contexts?.map(({ name }) => name) || null,
      action: sessionIntent?.action || null,
      parameters: sessionIntent?.parameters?.map(({ key }) => key),
    };
    return si;
  };

  const queryText = async (text, title = '') => {
    let newMessage = {
      author: 'me',
      msg: { text: { text: text } },
      title,
    };
    updateMessages(newMessage);
    const { contexts, action, parameters } = getSessionIntent();
    console.log({ contexts, action, parameters });
    const req = {
      text,
      inContext: contexts,
      // action,
      parameters,
    };
    const result = await axios.post('/api/chatbot/query-text', req);
    setSessionIntent(result?.data?.intent);
    result?.data?.msg?.forEach((data) => {
      newMessage = {
        author: 'bot',
        msg: data,
      };
      updateMessages(newMessage);
    });
  };

  const queryEvent = async (event, hasText = null) => {
    if (hasText) {
      let newMessage = {
        author: 'me',
        msg: { text: { text: hasText } },
      };
      updateMessages(newMessage);
    }
    const { contexts, action, parameters } = getSessionIntent();
    const req = {
      event,
      inContext: contexts,
      parameters,
      action,
    };
    const result = await axios.post('/api/chatbot/query-event', req);
    setSessionIntent(result?.data?.intent);
    result?.data?.msg?.forEach((data) => {
      let newMessage = {
        author: 'bot',
        msg: data,
      };
      updateMessages(newMessage);
    });
  };

  const renderMessage = (msg, index) => {
    const isText = msg.msg?.text?.text;
    if (isText)
      return (
        <Message
          key={index}
          index={index}
          author={msg.author}
          content={msg.msg.text.text}
          title={msg.title}
        />
      );

    switch (msg.msg?.type) {
      case 'options':
        return (
          <Option
            key={index}
            index={index}
            content={msg.msg.payload}
            queryEvent={queryEvent}
            setMessages={setMessages}
            setDisabledInput={setDisabledInput}
          />
        );

      case 'image':
        return (
          <Message
            key={index}
            index={index}
            author={msg.author}
            content={msg.msg.payload}
            title={msg.title}
            isImage={true}
          />
        );

      case 'chips':
        return (
          <Chips
            key={index}
            index={index}
            content={msg.msg.payload}
            inputRef={inputRef}
          />
        );

      default:
        return null;
    }
  };

  const renderMessages = (messages) => {
    return messages
      ? messages.map((message, index) => {
          return renderMessage(message, index);
        })
      : null;
  };

  const handleInputMessage = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      queryText(event.target.value);
      event.target.value = '';
      handleInputDelay();
    }
  };

  const handleButtonMessage = () => {
    if (inputRef.current.value.trim() !== '') {
      queryText(inputRef.current.value);
      inputRef.current.value = '';
      handleInputDelay();
    }
  };

  const handleInputDelay = () => {
    setDisabledInput(true);
    setTimeout(() => {
      setDisabledInput(false);
    }, 900);
    setTimeout(() => {
      inputRef.current.focus();
    }, 1000);
  };

  return (
    <div className="card chat-bot-container mx-auto">
      <div
        className="card-header text-center p-3 border-bottom-0"
        style={{
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
        }}
      >
        <p className="mb-0 fw-bold fs-5">
          <span className="dot"></span> Nhà hàng Thuận Phát v2
        </p>
      </div>

      <div className="card-body chat-bot">
        {renderMessages(messages)}
        <div ref={elementRef} />
      </div>

      <div
        className="card-footer input-group border-top-0"
        style={{
          borderBottomLeftRadius: '15px',
          borderBottomRightRadius: '15px',
        }}
      >
        <input
          type="text"
          autoFocus
          name="inputMessage"
          placeholder='Nhập "quay lại" nếu không muốn tiếp tục ...  '
          ref={inputRef}
          onKeyUp={handleInputMessage}
          className="form-control"
          disabled={disabledInput}
        />

        <button onClick={handleButtonMessage} className="input-group-text">
          <i className="fa fa-paper-plane" style={{ color: '#9c191b' }}></i>
        </button>
      </div>
    </div>
  );
}
