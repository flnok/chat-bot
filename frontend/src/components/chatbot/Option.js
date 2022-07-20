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
    const event =
      opt.structValue.fields.event?.structValue.fields.name?.stringValue;
    const title = opt.structValue.fields.title?.stringValue;
    const parameters =
      opt.structValue.fields.event?.structValue.fields.parameters?.structValue;
    props.queryEvent(event, title, parameters);
  };

  return (
    <div key={props.index} className="d-flex flex-row justify-content-end mb-4">
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
