import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/bookings');
        setBookings(res.data.bookings);
      } catch (err) {
        console.log(err);
        if (
          err.response.status === 401 &&
          err.response?.data?.errorStatus === 'NOT_LOGIN'
        ) {
          auth.logout(() => {
            navigate('/login');
          });
        }
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

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
    return bookings
      ? bookings.map((booking, index) => {
          return (
            <tr key={index}>
              <th>{index + 1}</th>
              <td>
                {booking.date} | {booking.time}
              </td>
              <td>{booking.person}</td>
              <td>{booking.phone}</td>
              <td>{booking.guestAmount}</td>
              <td>{booking.rate}</td>
              <td>{renderButton(booking._id)}</td>
            </tr>
          );
        })
      : null;
  };

  return (
    <>
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
                <th scope="col">Số lượng khách</th>
                <th scope="col">Đánh giá chatbot</th>
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
