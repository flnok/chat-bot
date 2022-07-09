// eslint-disable-next-line
import { Row, Col, Card } from 'react-bootstrap';

export default function Message(props) {
  return (
    <Card className="chat-bot-message">
      <Card.Body>
        <Row>
          {props.author === 'bot' && (
            <Col xs={2}>
              <div className="user-photo shadow">
                <img src="images/abc.png" className="img-fluid" alt="" />
              </div>
              <div className="text-center">{props.author}</div>
            </Col>
          )}
          <Col>
            <span className="black-text">{props.content.toString()}</span>
          </Col>
          {props.author === 'me' && (
            <Col xs={2}>
              <div className="user-photo shadow">
                <img src="images/abc.png" className="img-fluid" alt="" />
              </div>
              <div className="text-center">{props.author}</div>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}
