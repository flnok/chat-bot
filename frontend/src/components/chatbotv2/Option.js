import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Option(props) {
  const navigate = useNavigate();

  function navigateClick(link) {
    navigate(`/${link}`);
  }

  const renderOptions = (options) => {
    return options.map((opt, index) => (
      <Button
        key={index}
        onClick={() => handleOption(opt)}
        variant="outline-danger"
        className="rounded-pill my-1"
      >
        <span className="small">{opt.title}</span>
      </Button>
    ));
  };

  const handleOption = (opt) => {
    props.setDisabledInput(false);
    const isLink = opt.link;
    if (isLink) {
      navigateClick(opt.link);
    } else {
      props.setMessages([]);
      const event = opt.event;
      const title = opt.title;
      const parameters = opt.parameters;
      const intent = opt.intent || '';
      const inContext = opt.inContext || '';
      props.queryEvent(event, title, intent, inContext, parameters);
    }
  };

  return (
    <div key={props.key} className="d-flex flex-row justify-content-end mb-4">
      <div
        className="p-3 pt-0"
        style={{
          borderRadius: '15px',
        }}
      >
        <div className="option-content">
          {renderOptions(props.content.list)}
        </div>
      </div>
    </div>
  );
}
