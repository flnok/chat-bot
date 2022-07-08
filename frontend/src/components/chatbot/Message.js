// eslint-disable-next-line
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';

export default function Message(props) {
  return (
    <Card className="chat-bot-message">
      <Card.Body>
        <Row>
          {props.author === 'bot' && (
            <Col xs={2}>
              <div class="user-photo shadow">
                <img
                  src="%PUBLIC_URL%/abc.png"
                  class="img-fluid"
                  alt="testimonial slider"
                />
              </div>
              <div className="text-center">{props.author}</div>
            </Col>
          )}
          <Col>
            <span className="black-text">{props.content.toString()}</span>
          </Col>
          {props.author === 'me' && (
            <Col xs={2}>
              <div>{props.author}</div>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}
