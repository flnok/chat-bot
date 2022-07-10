import { Button } from 'react-bootstrap';

export default function Option(props) {
  const handleOption = () => {
    const text =
      props.content.structValue.fields.event?.structValue.fields.name
        ?.stringValue;
    const title = props.content.structValue.fields.title?.stringValue;
    props.queryText(text, title);
  };

  return (
    <Button
      onClick={handleOption}
      variant="outline-primary"
      className="rounded-pill my-1"
    >
      <span className="small">
        {props.content.structValue.fields.title?.stringValue}
      </span>
    </Button>
  );
}
