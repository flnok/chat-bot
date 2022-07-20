import { Button } from 'react-bootstrap';
import moment from 'moment';

export default function Chips(props) {
  const renderChips = (chips) => {
    return chips.map((c, index) => (
      <Button
        key={index}
        onClick={() => handleChipClick(c)}
        variant="outline-dark"
        className="rounded-pill my-1 mx-2"
      >
        <span className="small">
          {c.structValue?.fields?.text?.stringValue}
        </span>
      </Button>
    ));
  };

  const handleChipClick = (c) => {
    let text = c.structValue?.fields?.text?.stringValue;
    switch (text) {
      case 'Hôm nay':
        const [date, time] = moment().format('DD-MM-YYYY HH:mm').split(' ');
        text = `${time} ${date}`;
        props.inputRef.current.value = text;
        break;

      case 'Ngày mai':
        const [date2, time2] = moment()
          .add(1, 'days')
          .format('DD-MM-YYYY HH:mm')
          .split(' ');
        text = `${time2} ${date2}`;
        props.inputRef.current.value = text;
        break;

      default:
        break;
    }
    props.inputRef.current.value = text;
  };

  return (
    <div
      key={props.index}
      className="d-flex flex-row justify-content-center mb-4"
    >
      <div
        className="p-3 pt-0"
        style={{
          borderRadius: '15px',
        }}
      >
        <div className="chip-content">{renderChips(props.content)}</div>
      </div>
    </div>
  );
}
