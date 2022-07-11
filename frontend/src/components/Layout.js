import Header from './Header';
import { Outlet } from 'react-router-dom';
import Chatbot from './chatbot/Chatbot';
import { Col, Container } from 'react-bootstrap';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <div className="header">
        <Header />
      </div>

      <Container fluid>
        <div className="main row">
          <Col xs={12} md={5} className="text-center">
            <Container className="mx-0 mx-sm-3">
              <Outlet />
            </Container>
          </Col>

          <Col xs={12} md={7}>
            <Chatbot />
          </Col>
        </div>
      </Container>

      <div className="footer">
        <Footer />
      </div>
    </>
  );
}
