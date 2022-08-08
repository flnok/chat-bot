import moment from 'moment';
import { Button } from 'react-bootstrap';

export default function Chips(props) {
  const renderChips = (chips) => {
    return chips.map((c, index) => (
      <Button
        key={index}
        onClick={() => handleChipClick(c)}
        variant="outline-dark"
        className="rounded-pill my-1 mx-2"
      >
        <span className="small">{c.text}</span>
      </Button>
    ));
  };

  const handleChipClick = (c) => {
    const input = c.text;
    let text;
    // hard set
    switch (input) {
      case 'Hôm nay':
        const [date, time] = moment().format('DD-MM-YYYY HH:mm').split(' ');
        text = `${time} ${date}`;
        break;

      case 'Ngày mai':
        const [date2, time2] = moment()
          .add(1, 'days')
          .format('DD-MM-YYYY HH:mm')
          .split(' ');
        text = `${time2} ${date2}`;
        break;

      case '😍':
        text = `10`;
        break;

      case '👍':
        text = `8`;
        break;

      case '😊':
        text = `5`;
        break;

      case '👎':
        text = `0`;
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
