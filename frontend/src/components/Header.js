import { Container, Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { activeStyle, brandStyle } from '../assets/style';
import { useAuth } from '../context';

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar expand='lg' sticky='top'>
      <Container fluid className='flex-column'>
        <Row>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='m-auto text-center'>
              <Nav.Link
                as={NavLink}
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                to='/'>
                Home
              </Nav.Link>
              {!auth.isLogIn ? (
                <Nav.Link
                  as={NavLink}
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                  to='login'>
                  Login
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link
                    as={NavLink}
                    style={({ isActive }) => (isActive ? activeStyle : undefined)}
                    to='/dashboard'
                    end>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    style={({ isActive }) => (isActive ? activeStyle : undefined)}
                    to='/dashboard/chatbot'>
                    Chatbot
                  </Nav.Link>
                  <Nav.Link
                    as='a'
                    style={{
                      color: 'teal',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      auth.logout(() => navigate('/'));
                    }}>
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Row>

        <Row>
          <Navbar.Text href='/' style={brandStyle} className='noselect'>
            Nhà hàng Thuận Phát
          </Navbar.Text>
        </Row>
      </Container>
    </Navbar>
  );
}
