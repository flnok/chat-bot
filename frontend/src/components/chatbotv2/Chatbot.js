import { useEffect, useRef, useState } from 'react';
import { axiosQuery } from '../../apis';
import { mapParams } from '../../util/format';
import Chips from './Chips';
import Message from './Message';
import Option from './Option';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [sessionIntent, setSessionIntent] = useState(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const inputRef = useRef(null);
  const scrollToBottom = useRef(null);

  useEffect(() => {
    handleNewMessage();
  }, [messages]);

  useEffect(() => {
    (async function queryWelcome() {
      const data = await axiosQuery('event', { event: 'welcome' });
      setSessionIntent(data?.data);
      data?.msg?.forEach(data => {
        updateMessages({
          author: 'bot',
          data,
        });
      });
    })();
    // eslint-disable-next-line
  }, []);

  const handleNewMessage = () => {
    scrollToBottom.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  };

  const updateMessages = data => {
    const msg =
      data.author === 'me'
        ? {
            author: data.author,
            msg: { text: { text: data.text } },
            title: data.title,
          }
        : {
            author: data.author,
            msg: data.data,
          };
    setMessages(currentMessage => {
      return [...currentMessage, msg];
    });
  };

  const getSessionIntent = () => {
    return {
      contexts: sessionIntent?.contexts?.map(({ name }) => name) || null,
      fullInContexts: sessionIntent?.contexts,
      action: sessionIntent?.action || null,
      parameters: sessionIntent?.parameters?.map(({ key }) => key) || null,
    };
  };

  const queryText = async (text, title = '') => {
    updateMessages({ author: 'me', text, title });

    const { contexts, action, parameters, fullInContexts } = getSessionIntent();
    const request = {
      text,
      inContext: contexts,
      action,
      parameters,
      fullInContexts,
    };
    if (parameters.length > 0) request.parameters = mapParams(parameters, text);

    const result = await axiosQuery('text', request);
    setSessionIntent(result?.data);
    result?.msg?.forEach(data => updateMessages({ author: 'bot', data }));
  };

  const queryEvent = async (event, hasText = null) => {
    if (hasText) updateMessages({ author: 'me', text: hasText });

    const { contexts, action, parameters, fullInContexts } = getSessionIntent();
    const request = {
      event,
      inContext: contexts,
      action,
      parameters,
      fullInContexts,
    };
    if (parameters.length > 0) request.parameters = {};

    const result = await axiosQuery('event', request);
    setSessionIntent(result?.data);
    result?.msg?.forEach(data => updateMessages({ author: 'bot', data }));
  };

  const renderMessage = (message, index) => {
    const isText = message.msg?.text?.text;
    if (isText)
      return (
        <Message
          key={index}
          index={index}
          author={message.author}
          content={message.msg.text.text}
          title={message.title}
        />
      );

    switch (message.msg?.type) {
      case 'options':
        return (
          <Option
            key={index}
            index={index}
            content={message.msg.payload}
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
            author={message.author}
            content={message.msg.payload}
            title={message.title}
            isImage={true}
          />
        );

      case 'chips':
        return (
          <Chips key={index} index={index} content={message.msg.payload} inputRef={inputRef} />
        );

      default:
        return null;
    }
  };

  const renderMessages = messages => {
    return messages
      ? messages.map((message, index) => {
          return renderMessage(message, index);
        })
      : null;
  };

  const handleInputMessage = event => {
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
    <div className='card chat-bot-container mx-auto'>
      <div
        className='card-header text-center p-3 border-bottom-0'
        style={{
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
        }}>
        <p className='mb-0 fw-bold fs-5'>
          <span className='dot'></span> Nhà hàng Thuận Phát
          <small className='text-muted' style={{ fontSize: '0.8rem' }}>
            {' '}
            (cây nhà lá vườn)
          </small>
        </p>
      </div>

      <div className='card-body chat-bot'>
        {renderMessages(messages)}
        <div ref={scrollToBottom} />
      </div>

      <div
        className='card-footer input-group border-top-0'
        style={{
          borderBottomLeftRadius: '15px',
          borderBottomRightRadius: '15px',
        }}>
        <input
          type='text'
          autoFocus
          name='inputMessage'
          placeholder='Nhập "quay lại" nếu không muốn tiếp tục ...  '
          ref={inputRef}
          onKeyUp={handleInputMessage}
          className='form-control'
          disabled={disabledInput}
        />

        <button onClick={handleButtonMessage} className='input-group-text'>
          <i className='fa fa-paper-plane' style={{ color: '#9c191b' }}></i>
        </button>
      </div>
    </div>
  );
}
