import { Button } from 'react-bootstrap';
import { config } from '../../config/config';

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
      <img src={config.botAvatar} alt="avatar bot" className="avatar-bot" />

      <div
        className="p-3 pt-0"
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
