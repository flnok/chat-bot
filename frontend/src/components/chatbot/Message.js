import { config } from '../../config';

export default function Message(props) {
  return (
    <>
      {props.author === 'bot' && (
        <div key={props.index} className="d-flex justify-content-start mb-4">
          <img src={config.botAvatar} alt="avatar bot" className="avatar-bot" />
          <div className="p-3 ms-3 chat-bot-message-bot">
            <span className="small mb-0">
              {props.isImage === true ? (
                <>
                  <img
                    src={
                      props.content.listValue.values[0].listValue.values[0].structValue.fields
                        .rawUrl.stringValue
                    }
                    className="img-fluid"
                    alt="message"
                  />
                </>
              ) : (
                <> {props.title || props.content.toString()}</>
              )}
            </span>
          </div>
        </div>
      )}
      {props.author === 'me' && (
        <div key={props.index} className="d-flex justify-content-end mb-4">
          <div className="p-3 me-3 chat-bot-message-user">
            <span className="small mb-0">{props.title || props.content.toString()}</span>
          </div>
        </div>
      )}
    </>
  );
}
