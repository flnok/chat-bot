import { useEffect, useState } from 'react';
import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';

import axios from 'axios';

export default function Dashboard() {
  const [bookings, setBookings] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('/api/bookings');
      setBookings(res.data.bookings);
    }
    fetchData();
  }, []);

  if (!auth.loggedIn) {
    console.log('Chưa đăng nhập');
  }

  const removeBooking = (id) => {
    setBookings((current) =>
      current.filter((b) => {
        return b._id !== id;
      })
    );
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/bookings/${id}`);
      if (res.status === 200) removeBooking(id);
    } catch (error) {
      console.log(error);
    }
  };

  const renderButton = (id) => {
    return (
      <ul className="list-inline m-0">
        <li className="list-inline-item">
          <button
            className="btn btn-danger btn-sm rounded-0"
            type="button"
            data-toggle="tooltip"
            title="Delete"
            onClick={(e) => {
              handleDelete(id);
            }}
          >
            <i className="fa fa-trash"></i>
          </button>
        </li>
      </ul>
    );
  };

  const renderBookingInformation = (bookings) => {
    if (bookings) {
      return bookings.map((booking, index) => {
        return (
          <tr key={index}>
            <th>{index + 1}</th>
            <td>
              {booking.date} | {booking.time}
            </td>
            <td>{booking.person}</td>
            <td>{booking.phone}</td>
            <td>{booking.guestAmount}</td>
            <td>{renderButton(booking._id)}</td>
          </tr>
        );
      });
    }
    return null;
  };

  return (
    <>
      <div className="header">
        <Navbar expand="lg" sticky="top">
          <Container fluid className="flex-column">
            <Row>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="m-auto text-center">
                  <Nav.Link as={NavLink} className="nav-link" to="/">
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as="a"
                    className="nav-link"
                    style={{
                      color: '#8B8C89',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      auth.logout(() => navigate('/'));
                    }}
                  >
                    Logout
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Row>
          </Container>
        </Navbar>
      </div>

      <div>
        <div className="display-5 text-center">Thông tin đặt bàn</div>
        <Col className="text-center container table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Ngày giờ</th>
                <th scope="col">Tên</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Số kượng khách</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>{renderBookingInformation(bookings)}</tbody>
          </table>
        </Col>
      </div>
    </>
  );
}
