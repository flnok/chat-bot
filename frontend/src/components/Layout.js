import Header from './Header';
import { Outlet } from 'react-router-dom';
import Chatbot from './chatbot/Chatbot';
import { Col } from 'react-bootstrap';

export default function Layout() {
  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="main">
        <Col xs={4} className="text-center">
          <Outlet />
        </Col>
        <Col xs={8} className="d-flex justify-content-center">
          <Chatbot />
        </Col>
      </div>
    </div>
  );
}
