import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Nav, Offcanvas, Table } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { createIntent, fetchIntents } from '../../apis';
import { useAuth } from '../../context';
import { formatArray, formatPayload } from '../../util/format';

export default function ChatbotDashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [intent, setIntent] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const initialState = {
    name: '',
    inContexts: '',
    contexts: '',
    event: '',
    trainingPhrases: '',
    action: '',
    parameters: '',
    responses: '',
    payload: '',
  };
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    (async function fetchData() {
      const response = await fetchIntents();
      if (response.status === 401) {
        auth.logout(() => {
          navigate('/login');
        });
      }
      setIntent(response.data.data);
    })();
    // eslint-disable-next-line
  }, []);

  function renderIntents(intent) {
    return intent
      ? intent.map((intent, index) => {
          return (
            <tr key={index}>
              <td>
                <Nav.Link as={NavLink} to={`intent/${intent._id}`}>
                  <span className='text-uppercase text-dark'>{intent.name}</span>
                </Nav.Link>
              </td>
            </tr>
          );
        })
      : null;
  }

  return (
    <>
      <div className='display-5 text-center'>Danh sách các mẫu kịch bản</div>
      <div className='text-center'>
        <Button variant='outline-danger' size='lg' className='my-3' onClick={() => setShow(true)}>
          Tạo kịch bản
        </Button>

        <CreateCanvas
          show={show}
          handleClose={handleClose}
          setFormData={setFormData}
          initialState={initialState}
          formData={formData}
          setIntent={setIntent}
          intent={intent}
        />

        <Container>
          <Table variant='light' bordered hover>
            <tbody>{renderIntents(intent)}</tbody>
          </Table>
        </Container>
      </div>
    </>
  );
}

function CreateCanvas({
  show,
  handleClose,
  setFormData,
  initialState,
  formData,
  setIntent,
  intent,
}) {
  const [validate, setValidate] = useState(null);

  const handleSubmit = async event => {
    event.preventDefault();
    const data = {
      name: formData.name,
      event: formData.event?.trim()?.toUpperCase(),
      action: formData.event?.trim()?.toLowerCase(),
      responses: [],
    };
    data.inContexts = formatArray(formData.inContexts);
    data.contexts = formatArray(formData.contexts);
    data.trainingPhrases = formatArray(formData.trainingPhrases);
    data.parameters = formatArray(formData.parameters);
    if (formData.responses) data.responses.push({ type: 'text', text: formData.responses });
    if (formData.payload) {
      formatPayload(formData.payload)?.forEach(pl => {
        data.responses.push(pl);
      });
    }
    const response = await createIntent(data);
    if (response.status === 409) handleCreate('duplicate');
    else handleCreate('success', response.data.data);
  };

  const handleCreate = (status, data) => {
    switch (status) {
      case 'success':
        handleClose();
        setValidate(false);
        setFormData(initialState);
        setIntent([...intent, data]);
        break;
      case 'duplicate':
        setValidate(true);
        break;
      default:
        break;
    }
  };
  const ErrorCreateIntent = () => {
    return validate === true ? <Alert variant='danger'>Bị trùng tên</Alert> : null;
  };

  return (
    <Offcanvas show={show} onHide={handleClose} backdrop='static'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Tạo kịch bản</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label className='required'>Tên kịch bản</Form.Label>
            <Form.Control
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              value={formData.name}
              type='text'
              placeholder='vd: Đặt bàn, xem thông tin'
              required
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>InContexts</Form.Label>
            <Form.Control
              onChange={e => setFormData({ ...formData, inContexts: e.target.value })}
              value={formData.inContexts}
              type='text'
              placeholder='vd: Booking, Information'
            />
            <Form.Text className='text-muted'>Nhận vào ngữ cảnh</Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Context</Form.Label>
            <Form.Control
              onChange={e => setFormData({ ...formData, contexts: e.target.value })}
              value={formData.contexts}
              type='text'
              placeholder='vd: Booking, Information'
            />
            <Form.Text className='text-muted'>Ngữ cảnh của mẫu này</Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Event</Form.Label>
            <Form.Control
              onChange={e => setFormData({ ...formData, event: e.target.value })}
              value={formData.event}
              type='text'
              placeholder='vd: Booking, Information'
            />
            <Form.Text className='text-muted'>Sự kiện</Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Training Phrases</Form.Label>
            <Form.Control
              onChange={e =>
                setFormData({
                  ...formData,
                  trainingPhrases: e.target.value,
                })
              }
              value={formData.trainingPhrases}
              type='text'
              placeholder='vd: Tôi muốn đặt bàn, xem Menu'
            />
            <Form.Text className='text-muted'>Từ để chatbot nhận biết</Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Action</Form.Label>
            <Form.Control
              onChange={e => setFormData({ ...formData, action: e.target.value })}
              value={formData.action}
              type='text'
              placeholder='vd: Booking, Information'
            />
            <Form.Text className='text-muted'>Hành động</Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Parameters</Form.Label>
            <Form.Control
              onChange={e => setFormData({ ...formData, parameters: e.target.value })}
              value={formData.parameters}
              type='text'
              placeholder='vd: date, name, phone, ...'
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Responses</Form.Label>
            <Form.Control
              onChange={e => setFormData({ ...formData, responses: e.target.value })}
              value={formData.responses}
              type='text'
              placeholder='vd: Bạn muốn đặt bàn lúc nào?, Chào mừng bạn tới ... '
            />
            <Form.Control
              as='textarea'
              placeholder='Custom payload'
              style={{ height: '100px' }}
              onChange={e => setFormData({ ...formData, payload: e.target.value })}
              value={formData.payload}
            />
            <Form.Text className='text-muted'>Câu trả lời của chatbot</Form.Text>
          </Form.Group>
          <ErrorCreateIntent />
          <div className='d-grid gap-2 col-6 mx-auto'>
            <Button variant='primary' type='submit'>
              Tạo
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
