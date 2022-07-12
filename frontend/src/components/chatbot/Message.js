export default function Message(props) {
  const imgStyle = {
    width: '45px',
    height: '100%',
  };
  return (
    <>
      {props.author === 'bot' && (
        <div className="d-flex justify-content-start mb-4">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
            alt="avatar bot"
            style={imgStyle}
          />
          <div
            className="p-3 ms-3"
            style={{
              borderRadius: '15px',
              backgroundColor: 'rgba(57, 192, 237,.2)',
            }}
          >
            <span className="small mb-0">
              {props.title || props.content.toString()}
            </span>
          </div>
        </div>
      )}
      {props.author === 'me' && (
        <div className="d-flex justify-content-end mb-4">
          <div
            className="p-3 me-3 border"
            style={{
              borderRadius: '15px',
              backgroundColor: '#fbfbfb',
            }}
          >
            <span className="small mb-0">
              {props.title || props.content.toString()}
            </span>
          </div>
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
            alt="avatar user"
            style={imgStyle}
          />
        </div>
      )}
    </>
  );
}
