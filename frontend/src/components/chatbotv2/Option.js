import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Option(props) {
  const navigate = useNavigate();

  const handleOption = opt => {
    if (opt.link) {
      navigate(`/${opt.link}`);
    }
    props.setMessages([]);
    const event = opt.event;
    const hasText = opt.title;
    props.queryEvent(event, hasText);
  };

  const renderOptions = options => {
    return options.map((opt, index) => (
      <Button
        key={index}
        onClick={() => handleOption(opt)}
        variant="outline-danger"
        className="rounded-pill my-1">
        <span className="small">{opt.title}</span>
      </Button>
    ));
  };

  return (
    <div key={props.index} className="d-flex flex-row justify-content-end mb-4">
      <div
        className="p-3 pt-0"
        style={{
          borderRadius: '15px',
        }}>
        <div className="option-content">{renderOptions(props.content)}</div>
      </div>
    </div>
  );
}
