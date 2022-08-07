import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert } from 'react-bootstrap';

export default function Intent() {
  const [intent, setIntent] = useState(null);
  const [responses, setResponses] = useState(null);
  const auth = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const intent = await axios.get(`/api/chatbot/intent/${params.id}`);
        console.log(intent);
        setIntent(intent.data.intent);
        setResponses(intent.data.responses);
      } catch (error) {
        if (error.response.status === 401) {
          auth.logout(() => {
            navigate('/login');
          });
        }
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/chatbot/intent/${params.id}`);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
      const intent = await axios.put(`/api/chatbot/intent/${params.id}`);
      setIntent(intent.data);
    } catch (error) {
      console.log(error);
    }
  };

  function renderIntent(intent) {
    if (intent) {
      return (
        <>
          <div className="display-5 text-center mb-3">
            <span className="text-uppercase">{intent.name}</span>
          </div>

          <form>
            <div className="form-group row">
              <label className="col-4 col-form-label">Intent name</label>
              <div className="col-8">
                <div>{intent.name}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Context</label>
              <div className="col-8">
                <div style={{ whiteSpace: 'break-spaces' }}>
                  {intent.contexts?.map(({ name }) => {
                    return `[${name}], `;
                  })}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Event</label>
              <div className="col-8">
                <div>{intent.event}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Training Phrases</label>
              <div className="col-8">
                <div style={{ whiteSpace: 'break-spaces' }}>
                  {intent.trainingPhrases?.map((value) => `[${value}], `)}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-8">
                <div>{intent.action}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Parameters</label>
              <div className="col-8">
                <div style={{ whiteSpace: 'break-spaces' }}>
                  {intent.parameters?.map(
                    ({ key, value }) => `[${key}: ${value}]`
                  )}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Responses</label>
              <div className="col-8">
                <div>{intent.responses?.map((value) => value + '\n')}</div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Payload</label>
              <div className="col-8">
                <div>{intent.responses?.map((value) => value + '\n')}</div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-6 d-flex g-2 justify-content-around my-3 mx-auto">
                <Button
                  variant="primary"
                  onClick={() => setModalEditShow(true)}
                >
                  Update
                </Button>
                <Button variant="danger" onClick={() => setModalShow(true)}>
                  Delete
                </Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Go back
                </Button>
              </div>
            </div>
          </form>

          <ConfirmDelete
            show={modalShow}
            handleDelete={handleDelete}
            onHide={() => setModalShow(false)}
          />

          <EditModal
            intent={intent}
            show={modalEditShow}
            handleEdit={handleEdit}
            onHide={() => setModalEditShow(false)}
          />
        </>
      );
    }
    return null;
  }
  return <Container>{renderIntent(intent)}</Container>;
}

function ConfirmDelete(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc chắn muốn xóa mẫu này</Modal.Title>
      </Modal.Header>
      <Modal.Body>Xóa sẽ không khôi phục lại được</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.handleDelete}>
          Có
        </Button>
        <Button variant="secondary" onClick={props.onHide}>
          Không
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function EditModal(props) {
  const initialState = {
    name: props.intent.name || '',
    contexts: props.intent.contexts || '',
    event: props.intent.event || '',
    trainingPhrases: props.intent.trainingPhrases || '',
    action: props.intent.action || '',
    parameters: props.intent.parameters || '',
    responses: props.intent.responses || '',
    payload: props.intent.payload || '',
  };
  const [formData, setFormData] = useState(initialState);
  const [validate, setValidate] = useState(null);

  const showValidate = () => {
    return validate === true ? (
      <Alert variant="danger">Bị trùng tên</Alert>
    ) : null;
  };

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="required">Tên kịch bản</Form.Label>
            <Form.Control
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
              type="text"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Context</Form.Label>
            <Form.Control
              onChange={(e) =>
                setFormData({ ...formData, contexts: e.target.value })
              }
              value={formData.contexts}
              type="text"
              placeholder="vd: Booking, Information"
            />
            <Form.Text className="text-muted">Ngữ cảnh của mẫu này</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Event</Form.Label>
            <Form.Control
              onChange={(e) =>
                setFormData({ ...formData, event: e.target.value })
              }
              value={formData.event}
              type="text"
              placeholder="vd: Booking, Information"
            />
            <Form.Text className="text-muted">Sự kiện</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Training Phrases</Form.Label>
            <Form.Control
              onChange={(e) =>
                setFormData({
                  ...formData,
                  trainingPhrases: e.target.value,
                })
              }
              value={formData.trainingPhrases}
              type="text"
              placeholder="vd: Tôi muốn đặt bàn, xem Menu"
            />
            <Form.Text className="text-muted">
              Từ để chatbot nhận biết
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Action</Form.Label>
            <Form.Control
              onChange={(e) =>
                setFormData({ ...formData, action: e.target.value })
              }
              value={formData.action}
              type="text"
              placeholder="vd: Booking, Information"
            />
            <Form.Text className="text-muted">Hành odn965</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Parameters</Form.Label>
            <Form.Control
              onChange={(e) =>
                setFormData({ ...formData, parameters: e.target.value })
              }
              value={formData.parameters}
              type="text"
              placeholder="vd: date, name, phone, ..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Responses</Form.Label>
            <Form.Control
              onChange={(e) =>
                setFormData({ ...formData, responses: e.target.value })
              }
              value={formData.responses}
              type="text"
              placeholder="vd: Bạn muốn đặt bàn lúc nào?, Chào mừng bạn tới ... "
            />
            <Form.Control
              as="textarea"
              placeholder="Custom payload"
              style={{ height: '100px' }}
              onChange={(e) =>
                setFormData({ ...formData, payload: e.target.value })
              }
              value={formData.payload}
            />
            <Form.Text className="text-muted">
              Câu trả lời của chatbot
            </Form.Text>
          </Form.Group>
          {showValidate()}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="info" onClick={props.handleEdit}>
          Cập nhật
        </Button>
        <Button variant="secondary" onClick={props.onHide}>
          Hủy
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
