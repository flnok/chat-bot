import { useState } from 'react';
import { Button } from 'react-bootstrap';

export default function Option(props) {
  const [disable, setDisable] = useState(false);

  const handleOption = async () => {
    props.setMessages([]);

    const text =
      props.content.structValue.fields.event?.structValue.fields.name
        ?.stringValue;
    const title = props.content.structValue.fields.title?.stringValue;
    await props.queryText(text, title);
    // setDisable(true);
    // let copy = [...props.messages];
    // const index = props.messages.length - 1;
    // if (index !== -1) {
    //   copy.splice(0, 2);
    //   props.setMessages(copy);
    // }
    // console.log(copy);
    // props.setMessages(messages);
  };

  return (
    <Button
      onClick={handleOption}
      variant="outline-primary"
      className="rounded-pill my-1"
      // disabled={disable}
    >
      <span className="small">
        {props.content.structValue.fields.title?.stringValue}
      </span>
    </Button>
  );
}
