import { Container, Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

export default function Header() {
  const auth = useAuth();
  const activeStyle = {
    color: '#8B8C89',
    textDecoration: 'none',
  };
  const brandStyle = {
    color: '#C52233',
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
            <Nav className="m-auto text-center">
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
                to="menu"
              >
                Menu
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                className="nav-link"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                to="contact"
              >
                Contact
              </Nav.Link>
              {!auth.isLogIn ? (
                <Nav.Link
                  as={NavLink}
                  className="nav-link"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                  to="login"
                >
                  Login
                </Nav.Link>
              ) : (
                <Nav.Link
                  as={NavLink}
                  className="nav-link"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                  to="dashboard"
                >
                  Dashboard
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Row>
        <Row>
          <Navbar.Text href="/" style={brandStyle} className="noselect">
            Nhà hàng Thuận Phát
          </Navbar.Text>
        </Row>
      </Container>
    </Navbar>
  );
}
