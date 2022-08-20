import { config } from '../../config';

export default function Message(props) {
  return (
    <>
      {props.author === 'bot' && (
        <div key={props.index} className='d-flex justify-content-start mb-4'>
          <img src={config.botAvatarV2} alt='avatar bot' className='avatar-bot' />
          <div className='p-3 ms-3 chat-bot-message-bot'>
            <span className='small mb-0'>
              {props.isImage === true ? (
                <>
                  {props.content?.map((img, index) => {
                    return <Image img={img} key={index} />;
                  })}
                </>
              ) : (
                <> {props.title || props.content.toString()}</>
              )}
            </span>
          </div>
        </div>
      )}
      {props.author === 'me' && (
        <div key={props.index} className='d-flex justify-content-end mb-4'>
          <div className='p-3 me-3 chat-bot-message-user'>
            <span className='small mb-0'>{props.title || props.content.toString()}</span>
          </div>
        </div>
      )}
    </>
  );
}

function Image({ img }) {
  return <img src={img.rawUrl} className='img-fluid' alt='message' />;
}
