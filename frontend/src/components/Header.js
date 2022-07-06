import { NavLink } from 'react-router-dom';
import { Container, Nav, Navbar, Row } from 'react-bootstrap';

export default function Header() {
  const activeStyle = {
    color: '#8B8C89',
    textDecoration: 'none',
  };
  const brandStyle = {
    color: 'black',
    fontFamily: "'Playball', cursive",
    fontSize: '50px',
    textAlign: 'center',
  };
  return (
    <Navbar expand="lg" sticky="top">
      <Container fluid className="flex-column">
        <Row>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="m-auto">
              <Nav.Link
                as={NavLink}
                className="nav-link"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                to="/"
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                className="nav-link"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                to="about"
              >
                About
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                className="nav-link"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                to="restaurant"
              >
                Restaurant
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Row>
        <Row>
          <Navbar.Text href="/" style={brandStyle} className="noselect">
            Nhà hàng lẩu Thuận Phát
          </Navbar.Text>
          {/* <Navbar.Brand>
            <img
              alt=""
              src="https://media.discordapp.net/attachments/994011424709943326/994037592674816050/logo.png"
              width="100"
              height="100"
              className="d-block align-center mx-auto"
            />
          </Navbar.Brand> */}
        </Row>
      </Container>
    </Navbar>
  );
}
