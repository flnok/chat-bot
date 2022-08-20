import { Container, Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';

export default function DashboardHeader() {
  const auth = useAuth();
  const navigate = useNavigate();
  const activeStyle = {
    color: '#8B8C89',
    textDecoration: 'none',
  };
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
                to='chatbot'>
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
            </Nav>
          </Navbar.Collapse>
        </Row>
      </Container>
    </Navbar>
  );
}
