import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'universal-cookie';
import Message from './Message';
import Option from './Option';
import Chips from './Chips';

const cookies = new Cookies();

export default function Chatbot(props) {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const [disabledInput, setDisabledInput] = useState(false);
  if (cookies.get('userID') === undefined) {
    cookies.set('userID', uuidv4(), { path: '/' });
  }

  const updateMessages = (msg) => {
    setMessages((currentMessage) => {
      return [...currentMessage, msg];
    });
  };

  const queryText = async (value, title = '') => {
    let newMessage = {
      author: 'me',
      msg: { text: { text: value } },
      title,
    };
    updateMessages(newMessage);

    const req = {
      queries: value,
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

  const queryEvent = async (event, hasText = null, parameters = {}) => {
    if (hasText) {
      let newMessage = {
        author: 'me',
        msg: { text: { text: hasText } },
      };
      updateMessages(newMessage);
    }

    const req = {
      queries: event,
      parameters,
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
    const isText = msg.msg?.text?.text;
    const isOption =
      msg.msg?.payload?.fields?.richContent?.listValue?.values[0]?.listValue
        ?.values[0]?.structValue?.fields?.type?.stringValue === 'list';
    const isImage =
      msg.msg?.payload?.fields?.richContent?.listValue?.values[0]?.listValue
        ?.values[0]?.structValue?.fields?.type?.stringValue === 'image';
    const isChips = msg.msg?.payload?.fields?.type?.stringValue === 'chips';

    if (isText) {
      return (
        <Message
          key={index}
          author={msg.author}
          content={msg.msg.text.text}
          title={msg.title}
        />
      );
    } else if (isOption) {
      return (
        <Option
          key={index}
          content={msg.msg.payload}
          queryEvent={queryEvent}
          setMessages={setMessages}
          setDisabledInput={setDisabledInput}
        />
      );
    } else if (isImage) {
      return (
        <Message
          key={index}
          author={msg.author}
          content={msg.msg.payload.fields.richContent}
          title={msg.title}
          isImage={true}
        />
      );
    } else if (isChips) {
      return (
        <Chips
          key={index}
          content={msg.msg.payload.fields.options.listValue.values}
          inputRef={inputRef}
        />
      );
    } else {
      return null;
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
      setDisabledInput(true);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, [messages]);

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
          <span className="dot"></span> Nh?? h??ng Thu???n Ph??t
        </p>
      </div>

      <div className="card-body chat-bot">
        {renderMessages(messages)}
        <ScrollToBottom messages={messages} />
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
          placeholder='Nh???p "quay l???i" n???u kh??ng mu???n ti???p t???c ...  '
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

function ScrollToBottom(props) {
  const elementRef = useRef(null);
  useEffect(() => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [props.messages]);
  return <div ref={elementRef} />;
}
