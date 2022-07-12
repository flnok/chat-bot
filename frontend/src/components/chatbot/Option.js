import { Button } from 'react-bootstrap';

export default function Option(props) {
  const renderOptions = (options) => {
    return options.map((opt, index) => (
      <Button
        key={index}
        onClick={() => handleOption(opt)}
        variant="outline-danger"
        className="rounded-pill my-1"
      >
        <span className="small">
          {opt.structValue.fields.title?.stringValue}
        </span>
      </Button>
    ));
  };

  const handleOption = (opt) => {
    props.setMessages([]);
    console.log(JSON.stringify(opt));
    const text =
      opt.structValue.fields.event?.structValue.fields.name?.stringValue;
    const title = opt.structValue.fields.title?.stringValue;
    props.queryText(text, title);
  };

  return (
    <div
      key={props.index}
      className="d-flex flex-row justify-content-start mb-4"
    >
      <img
        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
        alt="avatar bot"
        style={{
          width: '45px',
          height: '100%',
        }}
      />

      <div
        className="p-3 "
        style={{
          borderRadius: '15px',
        }}
      >
        <div className="option-content">
          {renderOptions(
            props.content.fields.richContent.listValue.values[0].listValue
              .values
          )}
        </div>
      </div>
    </div>
  );
}
