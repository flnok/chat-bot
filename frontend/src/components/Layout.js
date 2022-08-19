import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { Login } from '../pages';
import Chatbot from './chatbot/Chatbot';
import ChatbotV2 from './chatbotv2/Chatbot';
import Header from './Header';

export default function Layout() {
  const [version, setVersion] = useState('v2');

  return (
    <>
      <Container fluid className="header">
        <Header />
      </Container>

      <Row xs={1} md={2} className="main">
        <Col>
          <div className="px-0 px-sm-3 text-center">
            <Outlet />
          </div>
        </Col>

        <Col>{version === 'v1' ? <Chatbot /> : <ChatbotV2 />}</Col>
      </Row>

      <Container fluid className="footer text-end">
        <Button
          variant="outline-dark"
          size="lg"
          onClick={e => {
            version === 'v1' ? setVersion('v2') : setVersion('v1');
          }}>
          Đổi chatbot
        </Button>
      </Container>
    </>
  );
}
