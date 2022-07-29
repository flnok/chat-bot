import { Col, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Chatbot from './chatbot/Chatbot';
import Header from './Header';
// import Footer from './Footer';

export default function Layout() {
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

        <Col>
          <Chatbot />
        </Col>
      </Row>

      {/* <div className="footer">
        <Footer />
      </div> */}
    </>
  );
}
