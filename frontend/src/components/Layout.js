import Header from './Header';
import { Outlet } from 'react-router-dom';
import Chatbot from './chatbot/Chatbot';
import { Col } from 'react-bootstrap';
// import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <div className="header">
        <Header />
      </div>

      <div className="main row mx-0">
        <Col xs={12} md={6}>
          <div className="px-0 px-sm-3 text-center">
            <Outlet />
          </div>
        </Col>

        <Col xs={12} md={6}>
          <Chatbot />
        </Col>
      </div>

      {/* <div className="footer">
        <Footer />
      </div> */}
    </>
  );
}
