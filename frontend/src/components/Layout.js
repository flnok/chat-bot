import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Chatbot from './chatbot/Chatbot';
import ChatbotV2 from './chatbotv2/Chatbot';
import Header from './Header';
// import Footer from './Footer';

export default function Layout() {
  const [version, setVersion] = useState('v1');

  return (
    <>
      <div className="header">
        <Header />
      </div>

      <Row xs={1} md={2} className="main">
        <Col>
          <div className="px-0 px-sm-3 text-center">
            <Outlet />
          </div>
        </Col>

        <Col>{version === 'v1' ? <Chatbot /> : <ChatbotV2 />}</Col>
      </Row>

      <div className="footer text-end">
        <Button
          variant="outline-dark"
          size="lg"
          onClick={(e) => {
            version === 'v1' ? setVersion('v2') : setVersion('v1');
          }}
        >
          Đổi chatbot
        </Button>
      </div>
    </>
  );
}
